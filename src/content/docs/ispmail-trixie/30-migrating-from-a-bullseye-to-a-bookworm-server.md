---
title: Migrating from your old (Bullseye) server
lastUpdated: 2025-08-09
slug: ispmail-trixie/migrating-from-a-bullseye-to-a-bookworm-server
sidebar:
  order: 30
---

## Upgrade or fresh installation?

I recommend that you set up a new server and make sure that the new mail server is working correctly before you start
migrating existing email users to it. You may argue that Debian can be upgraded easily using “apt-get dist-upgrade” but
that is very dangerous on a live mail server. Automatic configuration changes may have evil side effects and you risk
losing emails. At least you are causing a downtime for your users.

If you follow my advice then get a new server and install Debian Trixie on it. Once the user mailboxes are migrated and
all works well you can tear down the old server.

Once your new server is installed come back here.

## Read before you type

Follow this guide to the end. Only then start attempting a migration. Inform your users about the migration and set a
time when you intend to move email accounts to the new server. The change will require a DNS change which takes a while
to be visible worldwide so your users will have a period when incoming email is delayed. If you proceed carefully
though, not a single email will be lost.

So you have your new server up and running and did everything to make it a working mail server? You really read all the
pages in this guide and did what they told you? Okay, then let’s start.

## Tune down the TTL of your MX record

The DNS “MX” record for your domain contains the hostname of your mail server. When switching to the new server you need
to change the MX record. Every DNS record has a TTL (time-to-live) that defines the period of time that a record will
stay valid even after you change it. Usually that TTL is rather high like 86400 seconds (=1 day). This information is
used by caching name servers that they can use the cached values for a day. Turn that TTL down temporarily to 60 seconds
so that the rest of the internet will pick up your change quicker. However it will take a day until everyone else on the
internet picks up your TTL change.

## Migrate the mailserver database

You need to copy the database that contains the control data about your email domains and accounts. Log into the old
(Bookworm) server as root and back up the *mailserver* database. That is as easy as running…

(TODO: sqlite)

```
mysqldump mailserver > mailserver.sql
```

Copy that file to the new server (using *scp*) and import it there:

```
mysql mailserver < mailserver.sql
```

Obviously any database changes on the old server from now on will have to be done on the new server as well until the
migration is done.

## Roundcube contacts

If your users are using Roundcube as a webmail interface then you should migrate their data like their contact lists.
Dump the SQL from the old server:

```
mysqldump roundcube > roundcube.sql
```

Copy that file to the new server and import it:

```
mysql roundcube < roundcube.sql
```

One caveat though. To distinguish multiple mail servers Roundcube stores the server’s name in the mail_host column of
the users table. So as a last step change that column if your new mail server has a new FQDN/hostname by running this
SQL query on the new roundcube database:

```sql
UPDATE users SET mail_host='new.mail.server';
```

## Migrate rspamd spam training data

If you have been using rspamd with the Redis backend then copy over the Redis database from your previous server.
Details are found in the rspamd chapter.

## Migrate the Maildirs hot

Fortunately Dovecot uses the maildir format that stores emails as plain files on disk. Login to the new (Bookworm)
server and use *rsync* to copy over the mails from the old (Bullseye) mail server:

```
rsync -va oldserver:/var/vmail/ /var/vmail/
```

(Note the trailing slashes. Type them exactly as shown above or your files will end up in wrong places.)

There is no need to shut down Dovecot on your production Bullseye server. Copying the files while Dovecot is running
will not break anything. This is called a “hot copy”. It may not be consistent but it will save time during the final
synchronization.

## Copy certificates

Copy over everything in /etc/letsencrypt and /var/lib/rspamd/dkim from your old to the new server.

```
rsync -va oldserver:/etc/letsencrypt/ /etc/letsencrypt/
rsync -va oldserver:/var/lib/rspamd/dkim/ /var/lib/rspamd/dkim/
```

## Downtime

You told your users about the downtime, right? The time has come? Okay. Shut down Dovecot on both servers.

## Migrate the emails cold

Let’s synchronize again. *rsync* will only copy those files that have changed which makes it much faster than the first
sync. On your new server run:

```
rsync -va --delete oldserver:/var/vmail/ /var/vmail/
```

(The “`--delete`” option makes sure that files that have been removed from the old server will also be deleted from the
new server. So if a user has deleted an email it will be deleted on the new server as well.)

The new Dovecot version uses a slightly different indexing mechanism. So force rebuilding the users’ indices:

```
doveadm force-resync -A '*'
```

## Switch the DNS records

For all your domains you will have to change the DNS “MX” or “A” record to point to your new server.

## Enable soft_bounce

Accidents happen. And you don’t want to lose emails. So run this command to enable your safety net on the new server:

```
postconf soft_bounce=yes
```

This makes Postfix always keep emails in the queue that it would otherwise reject. So you can fix any errors and the
queue will empty. Start Postfix and Dovecot on the new server. Watch your /var/log/mail.log and run “mailq” from time to
time to see what emails get stuck in the queue. If you are certain that emails can be removed from the queue then use
“postsuper -d QUEUE-ID” (as shown in the “mailq” output).

Once you are certain that emails are properly received and sent you can switch off the _soft_bounce_ mode again:

```
postconf soft_bounce=no
```

## Shut down the old server

If possible do a final backup of the old server. If users are not complaining then dismiss the old system after a week.

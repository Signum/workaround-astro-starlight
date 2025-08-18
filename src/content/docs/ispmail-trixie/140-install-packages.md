---
title: Install software packages
lastUpdated: 2025-08-14
slug: ispmail-trixie/install-the-software-packages
sidebar:
  order: 140
---

Let's install the necessary Debian packages. Run this command as root on your server as _root_:

```sh
DEBIAN_FRONTEND=noninteractive \
    apt -y install postfix-sqlite dovecot-sqlite \
    dovecot-imapd dovecot-lmtpd dovecot-managesieved \
    caddy php-fpm php-sqlite3 php-intl php-mbstring php-xml unzip \
    roundcube-sqlite3 roundcube swaks ufw mutt \
    crowdsec crowdsec-firewall-bouncer unattended-upgrades
```

While the server is downloading and installing the packages, let me give you a quick explanation of each package:

- **postfix-sqlite** \
  Postfix is the MTA (mail transport agent) that speaks SMTP to send and receive emails. This package installs Postfix
  with support for SQLite databases.
- **dovecot** \
  Dovecot manages the emsrc/content/docs/ispmail-trixie/140-install-packages.mdx emails using IMAP.
  - **-lmtpd** \
    LMTP (Local Mail Transfer Protocol) provides the glue between Postfix and Dovecot.
  - **-managesieved** \
    Lets you configure automatic processing rules on the server. Like out-of-office emails or filtering incoming emails
    to folders.
- **caddy** \
  Web server with automatic HTTPS support via Let's Encrypt certificates. Needed for webmail.
- **php-fpm** (and other php-\* packages) \
  PHP is the programming language that Roundcube (the webmail software) is written in. FPM (Fast Process Manager) is the
  glue between Caddy and PHP.
- **roundcube** / **roundcube-sqlite3** \
  Webmail software that lets you access your emails in any web browser. Roundcube speaks to Dovecot to fetch emails. And
  to Postfix to send emails.
- **swaks** \
  The SWiss Army Knife of Smtp. Helpful command-line tool to send test emails to a mail server.
- **ufw** \
  Universal FireWall. A simple tool to manage firewall rules to limit access to your server.
- **rspamd** \
  It reliably detects spam. Also handles adding DKIM signature to outgoing email to prevent spoofing your domains.
- **mutt** \
  A console-based program that can speak IMAP and also read Maildirs directly. Very helpful for testing the
  functionality of your mail server. Think of it as a text-based Thunderbird.
- **crowdsec** \
  Detects attacks to your mail server and blocks the IP address of the attacker. This is a more sophisticated version of
  fail2ban.
- **unattended-upgrades** \
  Installs security updates automatically.

TODO: move crowdsec into optional chapter

TODO: postfix in no-chroot mode

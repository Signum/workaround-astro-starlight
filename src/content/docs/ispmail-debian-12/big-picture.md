---
title: The big picture
---

The mail server that you are about to set up uses several software components. Let me first explain briefly what the purpose of each software is:

- **[Debian](https://www.debian.org/)** “Bookworm” – the operating system
- **[Postfix](http://www.postfix.org/)** receives incoming emails from the internet and sends out outgoing emails to other mail servers. It is the software that speaks SMTP.
- **[rspamd](https://rspamd.com/)** runs sanity checks on an incoming email to determine whether it is spam.
- **[Dovecot](https://www.dovecot.org/)** stores emails on your hard disk, applies filters and lets your users fetch their emails using the POP3 and IMAP protocols
- **[Roundcube](https://roundcube.net/)** is a webmail interface so users can read their emails using a web browser, manage their email rules and change their password
- **[MariaDB](https://mariadb.org/)** (formerly known as _MySQL_) is a database that stores information about your domains, email aliases and email accounts

## What happens when someone sends you an email?

Let us assume that you are responsible for the email domain _example.org_ and someone on the internet sends an email to `john@example.org`. This is what happens step by step:

1. **REMOTE:** Hey, DNS server. I have an email for someone in the _example.org_ domain. Can you tell me the name of the responsible mail server?  
    **DNS:** According to the DNS zone of _example.org_ it is _mx.example.org_.
2. **REMOTE**: Nice. Do you have an an IP address for _mx.example.org_?  
    **DNS:** I have an IPv4 address here. It is _85.25.72.76_.
3. _REMOTE connects to that IP address on TCP port 25 which is by definition used for SMTP – the [simple mail transport protocol](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)._  
    **POSTFIX:** Welcome. I am Postfix. Who is there? (“220 mx.example.org ESMTP Postfix”)  
    **REMOTE:** Hi, I am remote server. (“EHLO remoteserver”)  
    **POSTFIX:** Nice to meet you. I can offer a few features like pipelining and encryption by the way. (“STARTTLS, PIPELINING, SIZE 4000000, …”)  
    **REMOTE:** Let’s switch to an encrypted connection. (“STARTTLS”)  
    _(The connection is now using TLS encryption.)_  
    **REMOTE:** I have an email from `donald@duck.com` here. (“MAIL FROM:&lt;`donald@duck.com`&gt;”)  
    **POSTFIX:** I see. (“Ok”)  
    **REMOTE:** The email is meant for `john@example.org`. (“RCPT TO:&lt;`john@example.org`&gt;”)
4. **POSTFIX:** Hey database. _(Connects to TCP port 3306 on the local host to talk to MariaDB.)_ Could you check if _example.org_ is one of our mail domains? (“SELECT … from virtual_domains …”)  
    **MariaDB:** Yes, I have a domain like that.  
    **POSTFIX:** Oh, good. And do you have a mailbox or forwarding for someone called `john@example.org`? (“SELECT … from virtual\_aliases/virtual\_users …”)  
    **MariaDB:** Yes, there is a mailbox for that address.  
    **POSTIFX:** Hey, remote server. The recipient looks good. (“Ok”)  
    **REMOTE:** Roger. Then here’s the actual email. (“DATA”)  
    _(The remote server sends the email header and body.)_
5. _(POSTFIX connects to port 11332 on the local host to reach the rspamd.)_  
    **POSTFIX**: Hey, rspamd. I have a new email here. Could you give it a look for, you know, spam and stuff?  
    **RSPAMD:** Sure. Well, there are a few minor issues. But generally the mail looks good. I suggest you accept it.  
    **POSTFIX:** Hey, remote server. Your email is fine.
6. _(Postfix uses a socket file at /var/spool/postfix/private/dovecot-lmtp to talk to Dovecot.)_  
    **POSTFIX:** Hey, Dovecot. Here is a new email for `john@example.org`.
    **DOVECOT:** Got it.
7. _(Dovecot checks for additional Sieve rules and then stores the email on disk at /var/vmail/example.org/john/Maildir/INBOX)_

Phew, that was a lot. I hope it helps to understand though how the different components are involved until an email gets delivered.

The next situation I would like to explain is…

## What happens if a user fetches their email using IMAP/POP3?

This process is way simpler. It looks like this:

![](https://workaround.org/wp-content/uploads/fetch-email.png)

![](https://workaround.org/wp-content/uploads/fetch-email.png)

User connects through IMAP

1. The user usually has a mail client (also called a _[mail user agent](https://en.wikipedia.org/wiki/Email_client)_) that can use the POP3 or IMAP protocol to fetch emails from the mail server. I prefer Thunderbird for example. That mail client connects to the POP3 (TCP 110) or IMAP (TCP 143) port, sends the STARTTLS command that initiates an encrypted connection and sends the user’s username (which equals the email address in our case) and their password. The client may as well use the secure TLS-encrypted ports directly – 995 for POPs and 993 for IMAPs. If possible users should use IMAP. POP3 is pretty much deprecated nowadays and lacks support for multiple folders on the server.
2. Dovecot sends a query to the MySQL database and verifies that the username and password belong to a known user. The password is not stored in plain text in the database. Instead it computes the password [hash](https://en.wikipedia.org/wiki/Hash_function) and compares it to the hash in the database. If the password is wrong then Dovecot will refuse the login.
3. We have a fixed scheme how emails are stored on disk. So if the user is called `jane@example.org` then Dovecot will look for email files in _/var/vmail/example.org/jane/Maildir/…_ and send the user the requested emails.

Nowadays many users seem to prefer webmail to a mail client installed on their computers. As an email power user I honestly do not understand that trend. But who am I to judge. So let’s take a look how webmail works technically:

## What happens if a user reads their email using web mail?

The Roundcube software that provides the web mail interface is basically a PHP software that is a gateway between HTML pages and a built-in IMAP client. So when a user uses their browser to connect to the web mail interface…

![](https://workaround.org/wp-content/uploads/webmail.png)

![](https://workaround.org/wp-content/uploads/webmail.png)

User connects through webmail

1. The user points the browser to the HTTPS URL of the webmail interface. Apache web server receives the connection and runs the PHP scripts of Roundcube. Roundcube shows a login form for the username and password. The user enters the username (that equals the email address) and the password and submits the login form.
2. Roundcube connects to Dovecot using IMAP and forwards the username and password to check if they are valid.
3. Dovecot treats this connection similar to a mail client connection. It queries the MariaDB database to verify the username (=email address) and password.
4. If the authentication was successful Dovecot fetches the mail files from disk and sends them through IMAP to Roundcube. Roundcube then renders the emails as HTML and the user can read it.

So you see that the web mail access also works through IMAP. The user does not realize that though.

Okay, the final scenario I would like to explain is…

## What happens if the user wants to send an email to the internet?

Of course your users also want to send emails to other internet users. But they cannot send the email directly to the destination mail server. First their mail client does not know which destination server is responsible for the recipient (hint: DNS) – that functionality just is not built in. And second the user is likely assigned a _dynamic IP address_ which is blocked by most mail servers because they tend to get abused by infected Windows PCs that send out spam. So the correct way to send an email to the internet is through your mail server. This is called _relaying_ because your mail server acts as a relay. In this example your user wants to send an email to `fred@example.net`.

![](https://workaround.org/wp-content/uploads/relaying.png)

![](https://workaround.org/wp-content/uploads/relaying.png)

Relaying/sending email via the mail server

1. The user writes the email in their mail client and clicks on “Send”. The mail client establishes an SMTP connection to Postfix. To make sure that the user is allowed to send email through your system it requires a username and password along with the email. This information is sent in an encrypted way.
2. Postfix could now check the password in the database directly. But as Dovecot already knows how to handle authentication it is easier to ask Dovecot to verify the username and password. (SMTP authentication in Postfix is surprisingly ugly.)
3. Dovecot now sends a query to the MariaDB database to check if the username and password (hash) are correct and tells Postfix the result.
4. Postftix knows now that it is authorized to send the email on behalf of the user. It tells the user that it successfully accepted the email. The email is put into Postfix’s mail queue for further processing. Postfix will now query a DNS (name server) to determine the responsible destination mail server. As the recipient has an “…@example.net” address it checks the MX record of the “example.net” domain and then gets the respective IP address.
5. Postfix now knows which mail server to send the email to. It opens an SMTP connection and delivers the email.
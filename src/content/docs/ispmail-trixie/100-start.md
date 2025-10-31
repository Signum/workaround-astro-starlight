---
title: Start here
lastUpdated: 2025-08-09
slug: ispmail-trixie
sidebar:
  order: 100
---

Good to have you here. This is the 12th edition of the ISPmail guide. A free guide to setting up a mail server for
friends and family using open-source software. Email on the internet nowadays is in the hands of few huge companies.
Take back control and host your own mail server. Get a cheap virtual server and read along. This guide is comprehensive
and will walk you through everything you need to know. I am publishing this guide without any commercial motives. All
you need to invest is your time. And thanks to Debian you will get automatic security updates and do not have to worry
about anything until the next stable release comes out in 2-3 years. And perhaps you come back then to upgrade your
server.

## What your mail server will do

- **Receive** emails on (multiple) domains.
- **Filter** out spam.
- **Send** emails out to the internet. Connections will be encrypted when possible.
- **Store** as many emails for as many email addresses as you have disk space. Set limits (“quotas”) per user. The only
  limit is the size of your disk.
- Have a **webmail** interface so users can access their emails securely from any location using a web browser.
- Let your users fetch email using **IMAP** and send email through your servers using **SMTP**.
- Add automatic cryptographic signatures using DKIM to outgoing emails to prove that you are the owner of your domain.
- Allow users to manage server-based **filter rules**. Distribute incoming emails to different folders. Forward copies.
  Or send out-of-office notifications.
- Mitigate **brute force** attacks.

## What you will need

- **Linux experience**. Preferably a Debian-derivative. No godlike skills required. But know your basics: navigating the
  file system, editing files, watching log files. Have some basic understanding of DNS. Bonus points if you have played
  with an SQL database and know about SELECT, INSERT, rows, columns.
- **Time**. 2 hours to get the basic service running. Maybe a day if you are not an everyday Debian user.
- A **server** that runs [Debian Trixie](https://www.debian.org/releases/trixie/). 1 GB of RAM and a 20 GB disk/SSD is
  fine for your friends and family. Just rent a cheap virtual server. Other distributions than Debian come with other
  versions of the software and have different configurations and paths on disk. It will work but you will need to
  deviate from this guide and do some research. So for the smoothest ride go with Debian.
- The hosting provider you chose to run your server on needs to allow **SMTP send and receive**. These providers are
  known to be troublesome:
  - Hetzner (DE, FI, US): Will allow SMTP after a month of paying for their service and per a request issued at
    https://console.hetzner.cloud/limits
  - DigitalOcean (US): Blocks SMTP and tells you that running your own mail server is a bad idea. Avoid.
- Your server needs to have a public **IP address** that does not belong to a range of typical ISP customers. You
  usually can’t operate the mail server from a residential IP address at home because those IP ranges are blacklisted by
  most other mail servers. Make sure that your IP address is not [blacklisted](https://multirbl.valli.org/) before you
  start. If you rent a virtual server from your favorite hosting company you probably won’t have any problems. But if
  you want to run the service from your home, this is something you need to check.
- An **internet domain** (or several) to receive emails for. You need to be able to set A, MX and TXT records for that
  domain. You should also be able to set PTR records for your IP address because some mail servers on the internet
  require you to have matching forward and reverse DNS records.
- **Patience**. We will proceed slowly and after every step ensure that are still on track. Don’t hurry and skip parts
  even if they appear confusing at first. If you get lost just submit your question at the bottom of any page throughout
  this guide and help is on the way. Or join the [chat channel](https://riot.im/app/#/room/#ispmail:matrix.org).

## What this is not about

If you just want to have a working mail server and do not care how it works then this guide is not for you. Check out
ready solutions like [mailinabox](https://mailinabox.email/) or [iRedMail](http://www.iredmail.org/) or
[Mailcow](https://mailcow.email/). Be aware that running a mail server requires some technical understanding. And that’s
what the ISPmail guide is for. Experience from giving support to other sysadmins shows that most problems appear because
some detail in a complex setup goes wrong and they have no idea how to fix it. Email has evolved a lot over the past 40
years. Go with ready solutions if you like. But I have a feeling that we meet again. And you will probably not save time
either taking the supposedly easy route.

## What's new

The last updates to this guide – up to Debian Bookworm – were mainly minor changes. However this time I have spent many
weeks to improve the guide. Most sections are completely rewritten. Explanations about SMTP versus submission were
added. I dived deep into RFCs and reference documentation. I have used more features of the
[Astro/Starlight](https://starlight.astro.build/) framework (the software that is used to render this guide) to add
visual guides like task lists or image galleries or foldout sections to help you understand what's going on on a mail
server without getting lost. And I have replaced all my configuration examples with blocks that you can copy/paste into
your shell. So this guide is supposed to be shorter and faster to follow while at the same time trying to be more
comprehensive. Please leave your feedback in the comment sections whether this approach appeals to you.

## Ready?

The entire tutorial is split into several pages. You can find the different chapters on the left. The navigation within
a chapter can be found on the right. Let’s go.

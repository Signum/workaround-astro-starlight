---
title: ISPmail guide for Debian 12 “Bookworm”
lastUpdated: 2023-09-24
---

Once upon a time there were many mail servers on the internet. If your organisation wanted to receive and send emails then you would have your system administrator set up a mail server. He would add a DNS record and create a cryptic Sendmail configuration file.

Fast forward a few decades and suddenly we have arrived in a monopolistic dystopy. The world of internet services is dominated by a few companies. Having worked in IT for 25 years I feel frustrated about the ignorance and laziness of decision makers. Cloud providers rip obscene profits and lock clueless customers in, while their IT staff is evolving into dumb victims instead of doing their actual job.

If you are like me then you want to stay as independent as possible. And that includes being in charge of your own email service. Maybe not for your employer but at least for yourself, your friends and family. Become your own internet service provider (ISP) for email. Hence the name: ISPmail.

This is a complete and free guide that teaches you how to set up and run your own mail server. At the end of the guide you will have your own fully featured mail server based on open-source software using a cheap virtual server for a few bucks per month. And you will have learned all about the various components, protocols and technologies. This guide has been battle-tested by thousands of other sysadmins and constantly evolved over the last 20 years. I am publishing this guide without any commercial motives, so all you would have to invest is your time.

## What your mail server can do

- **Receive** emails on your domains.
- **Filter** out spam. (We will not deal with detection of Wind*ws malware though.)
- **Send** emails out to any other servers/domains on the internet. Connections will be encrypted when possible.
- Add automatic cryptographic signatures (**[DKIM / Domain Keys](https://en.wikipedia.org/wiki/DomainKeys)**) to outgoing emails to prove that you are the owner of your domain.
- **Store** as many emails for as many email addresses as you have disk space. Set limits (“quotas”) per user. The only limit is the size of your disk.
- Let your users fetch email using **IMAP** or **POP3** and send email through your servers using **SMTP**.
- Allow users to manage server-based **filter rules**. Distribute incoming emails to different folders. Forward copies. Or send out-of-office notifications.
- Provide a **webmail** interface so users can access their emails securely from any location using a web browser.
- Mitigate **brute force** attacks.

## What you will need

- **Linux experience**. Preferably a Debian-derivative. No godlike skills required. But know your basics: navigating through the file system, editing files, watching log files. Have some basic understanding of DNS. Bonus points if you have played with an SQL database and know about SELECT, INSERT, rows, columns.
- **Time**. 2 hours to 2 days.
- A **server** that runs Debian Bookworm. 1 GB of RAM and a 20 GB disk/SSD is fine for your friends and family. Rent a cheap virtual server. Or use a decommissioned laptop. Other Linux distributions likely come with other versions of the software and have different configurations and paths on disk. It will work but you will need to deviate from this guide.
- The provider providing you with the server needs to allow **SMTP send and receive**. These providers are known to be troublesome:
    - Hetzner (DE, FI, US): Will allow SMTP after a month of paying for their service and per a request issued at https://console.hetzner.cloud/limits
    - DigitalOcean (US): Blocks SMTP and tells you that running your own mail server is a bad idea. Avoid.
- Your server needs to have a public **IP address** that does not belong to a range of typical ISP customers. You usually can’t operate the mail server from a dialup IP address at home because those IP ranges are blacklisted by most other mail servers. Make sure that your IP address is not [blacklisted](https://multirbl.valli.org/) before you start. If you rent a virtual server from your favorite hosting company you probably won’t have any problems.
- An **internet domain** (or several) to receive emails for. You need to be able to set A, MX and TXT records for that domain. You should also be able to set PTR records for your IP address because some mail servers on the internet require you to have matching forward and reverse DNS records.
- **Patience**. We will proceed slowly and after every step ensure that are still on track. Don’t hurry and skip parts even if they appear confusing at first. If you get lost just submit your question at the bottom of any page throughout this guide and help is on the way. Or join the [chat channel](https://riot.im/app/#/room/#ispmail:matrix.org).

## What this is not about

If you just want to have a working mail server and do not care how it works then this guide is not for you. Check out ready solutions like [mailinabox](https://mailinabox.email/) or [iRedMail](http://www.iredmail.org/). Running a mail server requires technical understanding. And that’s what the ISPmail guide is for. Experience from giving support to other sysadmins shows that most problems appear because some detail in a complex setup goes wrong and they have no idea how to fix it. Email has evolved a lot over the past 40 years. Go with ready solutions if you like. But I have a feeling that we meet again. And you will probably not save time either taking the supposedly easy route.

## Ready?

The entire tutorial is split into several pages. You can find the different chapters on the left. The navigation within a chapter can be found on the right. Let’s go.
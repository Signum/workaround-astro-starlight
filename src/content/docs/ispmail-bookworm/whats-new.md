---
title: What's new
lastUpdated: 2023-09-24
---


I try to keep as many parts of the setup unchanged. Many of us are happy with their mail servers and want to change as little as possible. Email is a boring matter anyway and we do our jobs best if our users don’t even realize that we are there.

A few things though that are new in this version of the ISPmail guide:

- **Newer software versions** – it is a new Debian release after all. There are no breaking changes. Just business as usual. If you want to check the changelogs here are the version changes:
    - Postfix 3.5.18 -&gt; 3.7.6
    - Dovecot 2.3.13 -&gt; 2.3.19
    - PHP 7.4 -&gt; 8.2
    - rspamd 2.7.1 -&gt; 3.4.1
    - Apache 2.4.56 -&gt; 2.4.57
    - Roundcube 1.4.13 -&gt; 1.6.1
    - MariaDB 1.21 -&gt; 1.22
    - Adminer 4.7.9 -&gt; 4.8.1
- An improved **Ansible** playbook to help you automate all the steps of this guide if you want to set up multiple servers without repeating all steps manually.
- Clearer explanations. I have reworded complex parts of the configuration.
- Fixed links. The Dovecot wiki has moved around quote a lot of pages and I didn’t notice earlier because it did not lead to a 404 or a redirect.
- Dovecot now uses the “count” backend to compute a user’s quota. Previous guides still used “maildir”.
- Two chapters are currently not published: the part about Thunderbird auto-configuration because there seem to be problems with the newest versions of Thunderbird. And the part about firewalling and fail2ban because there seems to be a bug with firewalld and fail2ban. These pages deal with optional features and are not a showstopper.
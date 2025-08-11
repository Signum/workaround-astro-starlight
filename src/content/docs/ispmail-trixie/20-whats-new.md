---
title: What's new
lastUpdated: 2025-08-09
slug: ispmail-trixie/whats-new
sidebar:
  order: 20
---

I try to keep things similar to previous versions of this guide. Most of us are happy with their mail servers and want
to change as little as possible when a new Debian release comes along.

A few things though that are new in this version of the ISPmail guide:

- **Newer software versions** – it is a new Debian release after all. There are no breaking changes. Just business as
  usual. If you want to check the changelogs here are the version changes:
  - Postfix 3.7.6 -&gt; 3.10.3
  - Dovecot 2.3.19 -&gt; 2.4.1
  - PHP 8.2 -&gt; 8.4 (for Roundcube webmail)
  - Apache 2.4.57 -&gt; 2.4.65
  - rspamd 3.4.1 -&gt; 3.12.1
  - Roundcube 1.6.1 -&gt; 1.6.11
  - MariaDB 1.22 -&gt; 11.8.2 (TODO: sqlite)
  - Adminer 4.8.1 -&gt; 5.2.1
- An improved **Ansible** playbook to help you automate all the steps of this guide if you want to set up multiple
  servers without repeating all steps manually. (TODO)
- Two chapters are currently not published: the part about Thunderbird auto-configuration because there seem to be
  problems with the newest versions of Thunderbird. And the part about firewalling and fail2ban because there seems to
  be a bug with firewalld and fail2ban. These pages deal with optional features and are not a showstopper. (TODO)

TODO: Postfix without chroot

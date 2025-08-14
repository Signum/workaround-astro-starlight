---
title: Virtual domains
lastUpdated: 2025-08-14
slug: ispmail-trixie/virtual-domains
sidebar:
  order: 150
---

import { Aside } from "@astrojs/starlight/components";

Your mail server will have one fully qualified domain name — for example, `postbox.example.com`. In this case, the base
domain is `example.com`. If someone visits `https://example.com/`, they might be greeted by the Roundcube webmail login
page.

But your server doesn’t have to handle only one domain. You might have users like:

- `jack@example.com`
- `lucy@example.com`
- `tina@example.org`
- `jeff@example.net`

These are three different domains, and your server can handle them all.

This is what _virtual domains_ are for. You give your mail server a list of domains and email addresses and it will
receive emails for them. Your users will also have passwords that they need to type in to retrieve their emails. You can
even set up mailing lists that take messages sent to one address and forward them to several users at once.

To make all this work, we’ll store the configuration in a small SQLite database file. Postfix, Dovecot, and Roundcube
will all read from this database to know which domains exist, which users they have, and where each email should go. You
will create that simple database on the next page.

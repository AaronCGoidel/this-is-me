---
title: SafeSend
slug: safesend
subtitle: Super secure messaging applying 2-FA to anything
cover: /safesend.png
tags: NodeJS, Security, React
links: safesend.cf, github.com/MKA-Stem/ayc-galvanize
---

# What's this?

SafeSend is a web app which allows users to send sensitive information securely over any protocol. We accomplish this by applying 2-factor-authentication to every message. Simply type in your information and the intended recipient's phone number and SafeSend generates a secure link which requires a 2-factor code to access.

SafeSend hashes your information and bakes that hash right into the secure link, in browser. Since all of this is done client-side, your information never hits a server.
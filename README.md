NAME
====
passwords.html - a password sequence generator

DESCRIPTION
===========
passwords.html is a standalone HTML file that contains a password sequence generator.

Initial passwords are generated by substituting parameter values into the initial template, appending \n, calculating the md5 hash of the resulting string. Templates are arbitrary strings which may optionally contain parameter reference markers. The supported parameters for the initial template are: user, host, salt, secret.

The output is the left-most 8 hex-digits of the resulting md5 sum. This value maybe used as a password or as the component of a password.

The default initial template is: ${user}:${secret}@${host}${salt}.

To use the generator to generate an initial password, enter a user or account name in the user field, a host or domain name
in the host field and a secret in the secret field. Use the 2nd secret field to confirm the secret. Then hit next. To see
the generated password, check the "show" checkbox.

Subsequent passwords are generated in the same way, this time using the next template as the template.
The next template can reference the previously generated output using the ${output} parameter reference. 

The default next template: is ${output}${secret}${salt}.

The generated bookmark links can be saved in a browser to reduce the amount of typing you need to do the next time you need to
generate (or re-generate) the password. Note that the generated bookmarks do include the salt but do not include any value derived from your
secret, including the output.

USAGE SCENARIOS
===============
Site-Specific Passwords
-----------------------
Instead of using the same password across multiple sites, generate a different password for each
site. Provided you keep your secret secure, compromise of one site's password database won't have
implications for accounts at other sites.

Password Renewal
----------------
Some sites force you to change your password periodically. It can be hard to remember a recently changed password but
you usually can remember the old password. If you assign passwords from the sequence, you can usually find
the current password simply by regenerating it.

Password Recovery
-----------------
On test and development systems it is common practice to share the same password across multiple systems 
even though this may be against recommended best practice. However, unless all accounts are regularly accessed,
less frequently used accounts may still use an older password. If you assign passwords from a sequence
you may be able to recover the password from the sequence, even if you have actually forgotten what that password was.

INSTALLATION
============
1. save https://github.com/jonseymour/passwords/raw/release/passwords.html to your local disk
2. verify that your copy of passwords.html matches the MD5 sum of a trusted version of this file as documented by https://github.com/jonseymour/passwords/raw/release/versions.txt
3. open the saved copy in your browser
4. optionally, modify the salt to some public, but arbitrary value
5. save the generated bookmark as a link 

SECURITY CONSIDERATIONS
=======================
The passwords generated by passwords.html may be secure provided:

* your secret is never compromised
* you only use this page in a trusted browser
* you only load this page from a trusted source
* you use a secure transport
* your bookmark store is secure

If any of these assumptions are not true, then your generated passwords will be easily compromised. 

In particular, man in the middle attacks will be trivial if an attacker can do enough to convince
you to load a maliciously altered copy of this page.

Rainbow table attacks on the secret may be mitigated somewhat by salting the template with a non-blank
${salt} parameter.

TRUST
=====
Should you trust this page to manage generated passwords securely? 

Not automatically. If a miscreant can arrange to make you load a maliciously altered copy of this page, your secret
and your passwords may be exposed.

However, if the page you are reading has an MD5 sum listed in https://github.com/jonseymour/passwords/raw/release/versions.txt then
the claims listed in the section below should be true.
CLAIMS
======
These claims apply only to pages that have an MD5 sum listed in https://github.com/jonseymour/passwords/raw/release/versions.txt. Anyone technically competent to do so is invited to verify that these claims are, in fact, true.

Such a page:

* never transmits or stores any value directly or indirectly derived from the secret
* never attempts to use the network for any purpose, including loading of resources such as scripts, CSS files or images
* never attempts to read or modify a user's cookies
* never attempts to misrepresent the target of dynamically generated links

You should be aware that any use of the generated bookmark link may expose any value you put into the initial template, next template, user, host or salt fields to third parties. Also, if you choose to bookmark such a link then those values will be stored in your browser's bookmark store.

VERSIONS
========
* Latest version - https://github.com/jonseymour/passwords/raw/release/
* Latest version MD5 - https://github.com/jonseymour/passwords/raw/release/passwords.md5
* Previous version MD5s - https://github.com/jonseymour/passwords/raw/release/versions.txt

AUTHOR
======
Copyright (C) Jon Seymour 2011<br/>
MD5 implementation Copyright (C) Paul Johnston, et al. 1999 - 2009

ACKNOWLEDGEMENTS
================
passwords.html makes use of Paul Johnson's JavaScript MD5 implementation - see http://pajhome.org.uk/crypt/md5 for more info

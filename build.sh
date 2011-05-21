#!/usr/bin/env bash

die()
{
    echo "fatal: $*" 1>&2
    exit 1
}

generate()
{
    test -n "$(which markdown) 2>/dev/null" || die "please install markdown"
    if ! {
	    cat > passwords.html <<EOF
<html id="html">
  <head>
    <title id='title'>password generator</title>
    <meta name="viewport" content="user-scalable=no,width=device-width"/>
    <style>
    $(cat style.css)
    </style>
    <script type="text/javascript">
    $(cat md5.js)
    $(cat mvc/binding.js)
    $(cat mvc/accessor.js)
    $(cat mvc/model.js)
    $(cat mvc/view.js)
    $(cat mvc/controller.js)
    $(cat mvc/mvc.js)
    $(cat controller.js)
    window.onload=loader;
    </script>
  </head>
  <body>
    $(cat form.html)
    <hr/>
    $(markdown README.md)
  </body>
</html>
EOF
	} &&
	test -f "passwords.html" 
    then
	die "build of passwords.html failed";
    fi
}

sign()
{
    test -n "$(which md5sum) 2>/dev/mull" || die "please install an md5sum implementation"
    test -f "passwords.html" || build
    md5sum=$(cat passwords.html | md5sum | cut -f1 -d' ') || die "md5 generation failed"
    echo $md5sum > passwords.md5 || die "saving md5 sum failed"
    cp passwords.html passwords-${md5sum}.html || die "saving versioned copy failed" 
    if ! grep $md5sum versions.txt >/dev/null 2>&1
    then
	echo  "$(date "+%Y%m%dT%H%M%S") ${md5sum}" >> versions.txt || die "updating versions failed"n
    fi
    echo $md5sum
}

release()
{
    generate
    git checkout versions.txt || die "unable to checkout versions.txt - check that you are on the release branch"
    sign
}

clean()
{
    rm passwords.html
}

test "$(type -t $1)" == "function" || die "usage: build.sh sign | generate"

$@

#!/bin/sh

die()
{
    echo "fatal: $*" 1>&2
    exit 1
}

generate()
{
    test -n "$(which markdown) 2>/dev/null" || die "please install markdown"
    test -f "passwords.md" || die "passwords.md must be in the current directory"
    if ! {
	    echo "<html><body>" &&
	    markdown passwords.md &&
	    echo "</body></html>"
	} > passwords.html &&
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
    echo  "$(date "+%Y%m%dT%H%M%S") ${md5sum}" >> versions.txt || die "updating versions failed"n
}

release()
{
    generate
    sign
}

test "$(type -t $1)" == "function" || die "usage: build.sh sign | generate"

$@
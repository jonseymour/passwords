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
	    echo "<html><head><title id="title">password generator</title><head></body>" &&
	    markdown passwords.md &&
	    echo "</body></html>"
	} > passwords.html &&
	test -f "passwords.html" 
    then
	die "build of passwords.html failed";
    fi
}

generate_README()
{
    md5sum=$1
    user=jonseymour
    repo=passwords
    branch=master
cat > README.md <<EOF
README
======
The MD5 of the latest version of <a href="/${user}/${repo}/raw/${branch}/passwords.html">passwords.html</a> is $md5sum. The self-signed version
of this file is found here - <a href="/${user}/${repo}/raw/${branch}/passwords-${md5sum}.html">/${user}/${repo}/raw/${branch}/password-${md5sum}.html</a> 

For more information about this project, refer to the home page.
EOF
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
    generate_README $md5sum
    echo $md5sum
}

release()
{
    generate
    git checkout versions.txt || die "unable to checkout versions.txt"
    ls passwords-*.html 2>/dev/null | xargs -n1 rm || die "remove previously signed copies"
    sign
}

test "$(type -t $1)" == "function" || die "usage: build.sh sign | generate"

$@
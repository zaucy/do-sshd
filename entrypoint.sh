#!/bin/ash

set -e

# generate host keys if not present
ssh-keygen -A

node ./digitalocean-ssh-keys.js

# do not detach (-D), log to stderr (-e), passthrough other arguments
exec /usr/sbin/sshd -D -e "$@"

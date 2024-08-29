#!/bin/bash

SWAPFILE=/var/swapfile

#주석이요...
if [ -f $SWAPFILE ]; then
  echo "$SWAPFILE found, skip"
  exit;
fi

/bin/fallocate -l 2G $SWAPFILE
/bin/chmod 600 $SWAPFILE
/sbin/mkswap $SWAPFILE
/sbin/swapon $SWAPFILE
/sbin/sysctl vm.swappiness=60
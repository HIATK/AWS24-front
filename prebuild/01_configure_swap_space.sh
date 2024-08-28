#!/bin/bash

SWAPFILE=/var/swapfile  # 스왑 파일의 위치 지정

# 스왑 파일이 이미 존재하는지 확인
if [ -f $SWAPFILE ]; then
  echo "$SWAPFILE found, skip"  # 파일이 존재하면 메시지 출력 후 종료
  exit;
fi

# 스왑 파일이 없으면 새로 생성
/bin/dd if=/dev/zero of=$SWAPFILE bs=1M count=2048  # 2GB 크기의 스왑 파일 생성
/bin/chmod 600 $SWAPFILE  # 스왑 파일의 권한을 600으로 설정 (보안상의 이유)
/sbin/mkswap $SWAPFILE  # 생성된 파일을 스왑 영역으로 포맷
/sbin/swapon $SWAPFILE  # 새로 생성한 스왑 파일 활성화
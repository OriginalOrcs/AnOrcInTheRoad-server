#!/bin/bash

ssh -v root@YOUR_IP_HERE << EOF

echo '1. Updating sources'
cd /patch/to/your/repository/
git checkout --force master
git pull origin master

echo 'Done!'

EOF

deployment:
  production:
    branch: master
    commands:
      - ./deploy_prod.sh

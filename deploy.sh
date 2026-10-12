#!/bin/bash

cd $(dirname $0)

# ???
export PATH=$PATH:~/.bun/bin

mkdir -p status
(timeout 300 bash ./scripts/update.sh status) &> status/update.log

mkdir -p dist
find status -name status.json | sort | xargs bun run build-dashboard.tsx > dist/index.html
echo $CNAME > dist/CNAME
find status -name \*.log | sort | xargs tar --owner=0 --group=0 -zcf dist/logs.tar.gz

echo "publishing..."
(cd dist; bash -c "$DEPLOY_COMMAND") &> deploy.log

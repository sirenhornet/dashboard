#!/bin/bash

cd $(dirname $0)

# ???
export PATH=$PATH:~/.bun/bin

mkdir -p status
(timeout 300 bash ./scripts/update.sh status) &> update.log

mkdir -p dist
find status -name status.json | sort | xargs bun run build-dashboard.tsx > dist/index.html
echo $CNAME > dist/CNAME

echo "publishing..."
(cd dist; bash -c "$DEPLOY_COMMAND") &> deploy.log

#!/bin/bash
mkdir -p dist
echo $CNAME > dist/CNAME
echo "DASHBOARD ($(date -u))" > dist/index.html
(cd dist; bash -c "$DEPLOY_COMMAND") &> deploy.log

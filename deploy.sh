#!/bin/bash

mkdir -p dist
echo $CNAME > dist/CNAME
echo "<pre>" > dist/index.html
echo "DASHBOARD ($(date -u))" >> dist/index.html

# check primal
echo "checking..."
(timeout 120 bash -c "$COMMAND_PRIMAL") &> primal.log
if [ -e primal/ok ]; then
	echo "PRIMAL: OK" >> dist/index.html
else
	echo "PRIMAL: NG" >> dist/index.html
fi
# check 24242
echo "checking..."
(timeout 120 bash -c "$COMMAND_24242") &> 24242.log
if [ -e 24242/ok ]; then
	echo "24242: OK" >> dist/index.html
else
	echo "24242: NG" >> dist/index.html
fi

# run
echo "executing..."
(bash -c "$COMMAND_RUN") &> run.log

echo "</pre>" >> dist/index.html

echo "publishing..."
(cd dist; bash -c "$DEPLOY_COMMAND") &> deploy.log

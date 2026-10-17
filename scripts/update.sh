#!/bin/bash

work=$(cd $1; pwd)
here=$(cd $(dirname $0); pwd)

# update contents
echo "updating..."

cd $work
# store trigger
mkdir -p $work/trigger
(cd trigger; $here/store-trigger.sh $work/trigger) &> $work/trigger/store-trigger.log

# check primal
statusprimal=NG
echo "checking..."
(timeout 120 bash -c "$COMMAND_PRIMAL") &> primal.log
[ -e primal/ok ] && statusprimal=OK
# check 24242
status24242=NG
echo "checking..."
(timeout 120 bash -c "$COMMAND_24242") &> 24242.log
[ -e 24242/ok ] && status24242=OK

# generate status.json
cat > status.json <<_EOF_
{
  "title": "blossom",
  "timestamp": $(date +%s),
  "status": [
    { "name": "PRIMAL", "status": "$statusprimal" },
    { "name": "24242", "status": "$status24242" }
  ]
}
_EOF_

echo "executing..."
(bash -c "$COMMAND_RUN") &> run.log

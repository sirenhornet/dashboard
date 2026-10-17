#!/bin/bash

work=$(cd $1; pwd)
here=$(cd $(dirname $0); pwd)

# update contents
echo "store trigger..."

cd $work

cat > status.json <<_EOF_
{
  "title": "trigger",
  "timestamp": $(date +%s),
  "status": [
    { "name": "trigger", "status": "$TRIGGER_EVENT_NAME" },
    { "name": "schedule", "status": "$TRIGGER_SCHEDULE" }
  ]
}
_EOF_

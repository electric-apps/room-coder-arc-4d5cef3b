#!/bin/bash
# Forward AskUserQuestion hook events to Electric Agent studio.
# Blocks until the user answers in the web UI.
BODY="$(cat)"
RESPONSE=$(curl -s -X POST "http://host.docker.internal:4400/api/sessions/4d5cef3b-8b4a-461b-95a9-f668bdb716d7/hook-event" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 49a81906c82c29d048758a94ecf45070a2195b0b997a8f553c5f599eeafb429c" \
  -d "${BODY}" \
  --max-time 360 \
  --connect-timeout 5 \
  2>/dev/null)
if echo "${RESPONSE}" | grep -q '"hookSpecificOutput"'; then
  echo "${RESPONSE}"
fi
exit 0
#!/bin/bash
# Worker lock file mechanism
LOCK_FILE="scripts/ralph/.worker-lock"

case "$1" in
  acquire)
    if [ -f "$LOCK_FILE" ]; then
      LOCK_AGE=$(($(date +%s) - $(stat -c %Y "$LOCK_FILE")))
      if [ $LOCK_AGE -lt 300 ]; then  # 5 min timeout
        echo "LOCKED by $(cat $LOCK_FILE)"
        exit 1
      fi
    fi
    echo "$(date -Iseconds) PID:$$" > "$LOCK_FILE"
    echo "ACQUIRED"
    ;;
  release)
    rm -f "$LOCK_FILE"
    echo "RELEASED"
    ;;
  status)
    if [ -f "$LOCK_FILE" ]; then
      echo "LOCKED: $(cat $LOCK_FILE)"
    else
      echo "FREE"
    fi
    ;;
esac

#!/bin/bash
if [ -n "$CODESPACES" ]; then
    gh codespace ports visibility 5000:public -c $CODESPACE_NAME > /dev/null 2>&1
else
    echo "Neither CODESPACES or GITPOD_WORKSPACE_URL environment variable is set"
fi

if [ -n "$CODESPACES" ]; then
    gh codespace ports visibility 5001:public -c $CODESPACE_NAME > /dev/null 2>&1
else
    echo "Neither CODESPACES or GITPOD_WORKSPACE_URL environment variable is set"
fi
#!/bin/sh
# Replace the placeholders with the actual SERVER_URI and SOCKET_URI values
find /usr/app/client/public -type f -print0 | xargs -0 sed -i "s|SERVER_URI|${SERVER_URI:-localhost:3000}|g"
find /usr/app/client/public -type f -print0 | xargs -0 sed -i "s|SOCKET_URI|${SOCKET_URI:-localhost}|g"

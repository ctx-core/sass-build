#!/bin/sh
echo sass-build.sh
# SEE https://github.com/sass/node-sass/issues/1579
# TODO: Use yarn when https://github.com/yarnpkg/yarn/issues/2069 is resolved
SASS_CMD="$(sass-cmd.js $@ -- '&')"
echo "$SASS_CMD"
eval "$SASS_CMD"
eval "$(sass-cmd.js $@ -- '&')"
wait
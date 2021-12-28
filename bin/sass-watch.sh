#!/bin/sh
nodemon -e css,scss,sass --watch . --ignore public/lib --ignore private/lib --exec sass-build.sh
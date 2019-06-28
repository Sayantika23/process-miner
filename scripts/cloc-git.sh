#!/usr/bin/env bash
git clone --depth 1 "$1" temp/$2 &&
printf "('$2' will be deleted automatically)\n\n\n" &&
npx cloc temp/$2 &&
rm -rf temp/$2
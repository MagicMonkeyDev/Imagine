#!/usr/bin/env bash
npm install
NODE_OPTIONS="--experimental-warning-disable" ./node_modules/.bin/prisma generate 
#!/bin/bash
npm cache clean --force
npm ci
chmod -R 755 node_modules

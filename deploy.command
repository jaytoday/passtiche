#!/bin/sh

# TODO: compression, etc.
cd `dirname $0`;
echo 'pulling from git';
git pull origin master;
echo 'running website test';
python passtiche/tests/website.py; 

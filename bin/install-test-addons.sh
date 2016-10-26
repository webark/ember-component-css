#!/bin/bash

rm -rf node_modules/test-addon
ln -s ../tests/dummy/lib/test-addon node_modules/test-addon

rm -rf node_modules/second-test-addon
ln -s ../tests/dummy/lib/second-test-addon node_modules/second-test-addon

rm -rf node_modules/no-style-files-yet
ln -s ../tests/dummy/lib/no-style-files-yet node_modules/no-style-files-yet

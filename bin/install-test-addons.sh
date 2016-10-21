#!/bin/bash

rm -rf node_modules/test-addon
ln -s ../tests/dummy/lib/test-addon node_modules/test-addon

rm -rf node_modules/second-test-addon
ln -s ../tests/dummy/lib/second-test-addon node_modules/second-test-addon

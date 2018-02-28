/* eslint-env node */
'use strict';

const fs = require('fs-extra');

fs.removeSync('node_modules/test-addon');
fs.symlinkSync('../tests/dummy/lib/test-addon', 'node_modules/test-addon');

fs.removeSync('node_modules/second-test-addon');
fs.symlinkSync('../tests/dummy/lib/second-test-addon', 'node_modules/second-test-addon');

fs.removeSync('node_modules/no-style-files-yet');
fs.symlinkSync('../tests/dummy/lib/no-style-files-yet', 'node_modules/no-style-files-yet');

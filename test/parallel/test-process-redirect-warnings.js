'use strict';

// Tests the --redirect-warnings command line flag by spawning
// a new child node process that emits a warning into a temporary
// warnings file. Once the process completes, the warning file is
// opened and the contents are validated

const common = require('../common');
const fs = require('fs');
const fork = require('child_process').fork;
const path = require('path');
const assert = require('assert');

common.refreshTmpDir();

const warnmod = require.resolve(`${common.fixturesDir}/warnings.js`);
const warnpath = path.join(common.tmpDir, 'warnings.txt');

fork(warnmod, { execArgv: [`--redirect-warnings=${warnpath}`] })
  .on('exit', common.mustCall(() => {
    fs.readFile(warnpath, 'utf8', common.mustCall((err, data) => {
      assert.ifError(err);
      assert(/\(ayo:\d+\) Warning: a bad practice warning/.test(data));
    }));
  }));

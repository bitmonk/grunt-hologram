/*
* grunt-hologram
*
*
* Copyright (c) 2014 James Childers
* Licensed under the MIT license.
*/

'use strict';
var which = require('which');

module.exports = function (grunt) {

  grunt.registerMultiTask('hologram', 'Generate Hologram style guides with Grunt', function () {

    var done = this.async();
    var options = this.options();
    var configPath;
    var cmd = options.bin || 'hologram';

    try {
      grunt.file.isFile(cmd) || which.sync('hologram');
    } catch (err) {
      return grunt.warn(
        '\nYou need to have Hologram installed and in your PATH for this task to work.\n' +
          '\nsudo gem install hologram\n'
      );
    }

    // Null check config option
    if (options.config) {
      configPath = options.config;
    } else {
      return grunt.warn(
        '\nYou must provide a path to your hologram config file.\n'
      );
    }

    // Make sure config file exists
    if (!grunt.file.exists(configPath)) {
      // this fails for relative paths currently, somehow
      grunt.warn('Config file "' + configPath + '" not found, cwd: ' + process.cwd() );
      //return grunt.warn('Config file "' + configPath + '" not found.');
    }

    // Run hologram
    var options = {
      cmd: cmd,
      args: [configPath]
    }

    function doneFunction(error, result, code) {
      grunt.log.write(result.stdout);
      grunt.log.write(result.stderr);
      if ( code > 0 ) {
        done(new Error('Exited with error code ' + code));
      }
    }
    grunt.util.spawn(options, doneFunction);

  });

};

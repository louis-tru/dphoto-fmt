#!/usr/bin/env node
/**
 * @copyright © 2018 Copyright dphoto.com
 * @date 2019-11-27
 */

var start = require('./fmt');
var arguments = require('nxkit/arguments');
var opts = arguments.options;
var help_info = arguments.helpInfo;
var def_opts = arguments.defOpts;

// def_opts(['help'],              0,             '--help   print help info');
def_opts(['host', 'h'],         '127.0.0.1',   '-h       server host [{0}]');
def_opts(['port', 'p'],         8091,          '-p       server port [{0}]');
def_opts(['fnodes', 'f'],       '',            '-f       connection to fnode [{0}]');
def_opts(['publish', 'pub'],    '',            '-pub     public fnode address [{0}]');

function printHelp(code = -1) {
	process.stdout.write('Usage:\n');
	process.stdout.write('  dfmt -f 127.0.0.1:8091 -f fnode://127.0.0.1:8092 -pub 127.0.0.1:8090\n');
	process.stdout.write('Options:\n');
	process.stdout.write('  ' + help_info.join('\n  ') + '\n');
	process.exit(code);
}

if (opts.help)
	printHelp();
else {
	var {fnodes,publish} = opts;
	fnodes = fnodes || [];
	fnodes = Array.isArray(fnodes) ? fnodes: [fnodes];

	opts.fnodes = fnodes.map(e=>{
		e = String(e);
		return e.match(/^fnodes?:\/\//) ? e: ('fnode://' + e);
	});
	if (publish) {
		publish = String(publish);
		opts.publish = publish.match(/^fnodes?:\/\//) ? publish: 'fnode://' + publish;
	}

	start(opts);
}
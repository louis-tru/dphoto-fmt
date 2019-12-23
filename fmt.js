/**
 * @copyright © 2018 Copyright dphoto.com
 * @date 2019-11-27
 */

var utils = require('nxkit');
var Center = require('./center');
var server = require('nxkit/server');
var log = require('./log');
var service = require('nxkit/service');

module.exports = function(config = utils.config) {

	var router = [
		{
			match: '/dmagic-api/{name}',
			service: '__mf',
			action: 'index',
		},
	];

	service.set('__mf', require('./magic'));
	service.set('api', require('./api'));

	var s = new server.Server({
		host: '127.0.0.1',
		port: 8091,
		root: `${__dirname}/public`,
		temp: `${__dirname}/var`,
		printLog: /*utils.config.moreLog || */utils.dev,
		defaults: ['index.html', 'index.htm', 'default.html'],
		...config,
		router: router,
	});

	s.start(); // start web server

	var {fnodes,publish} = config;
	fnodes = fnodes || [];
	fnodes = Array.isArray(fnodes) ? fnodes: [fnodes];
	// fmt center instance
	return new Center(s, fnodes, publish);
};

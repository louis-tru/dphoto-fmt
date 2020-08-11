/**
 * @copyright © 2018 Copyright dphoto.com
 * @date 2019-11-27
 */

var utils = require('somes').default;
var Center = require('./center');
var server = require('somes/server');
var log = require('./log');
var service = require('somes/service').default;

// require('http').globalAgent.maxSockets = 1000000;
// require('https').globalAgent.maxSockets = 1000000

module.exports = function(config = utils.config) {

	var router = [
		{
			match: '/dmagic-api/{__name}',
			service: '__mf',
			action: 'index',
		},
	];

	service.set('__mf', require('./magic'));
	service.set('api', require('./api'));

	var s = new server.ServerIMPL({
		host: '127.0.0.1',
		port: 8091,
		root: `${__dirname}/public`,
		temp: `${__dirname}/var`,
		printLog: /*utils.config.moreLog || */utils.dev,
		defaults: ['index.html', 'index.htm', 'default.html'],
		...config,
		router: router,
	});

	s.impl.maxSockets = 1000000;
	s.impl.maxConnections = 1000000;

	s.start(); // start web server

	var {fnodes,publish} = config;
	fnodes = fnodes || [];
	fnodes = Array.isArray(fnodes) ? fnodes: [fnodes];
	// fmt center instance
	return new Center(s, fnodes, publish);
};

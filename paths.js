/**
 * @copyright © 2018 Copyright dphone.com
 * @date 2018-11-05
 */

var fs = require('somes/fs');
var variable = __dirname + '/var';

fs.mkdir_p_sync(variable);
fs.writeFileSync(`${variable}/pid`, String(process.pid));

module.exports = {
	var: variable,
};

/**
 * @copyright © 2018 Copyright dphone.com
 * @date 2018-11-05
 */

var fs = require('nxkit/fs');
var variable = __dirname + '/var';

fs.mkdir_p_sync(variable);
fs.writeFileSync(`${variable}/pid`, process.pid);

module.exports = {
	var: variable,
};

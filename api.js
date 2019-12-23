/**
 * @copyright © 2018 Copyright dphoto.com
 * @date 2019-12-24
 */

var ctr = require('nxkit/ctr');
var fmt = require('nxkit/fmt');

/**
 * @class MagicForward
*/
module.exports = class API extends ctr.ViewController {

	onlineDevices() {
		var fmtc = fmt.fmtc(this.server);
		var result = [];
		for (var [id, route] of fmtc.routeTable) {
			result.push({
				id,
				fnodeId: route.fnodeId,
				time: route.time,
			});
		}
		return result;
	}
}
/**
 * @copyright © 2018 Copyright dphoto.com
 * @date 2019-11-29
 */

var utils = require('nxkit');
var ctr = require('nxkit/ctr');
var fmt = require('nxkit/fmt');
var errno = require('./errno');

/**
 * @class MagicForward
*/
module.exports = class MagicForward extends ctr.ViewController {

	async index({name, __sn, ...params }) {
		var { sn, ...headers } = this.headers;
		var fmtc = fmt.fmtc(this.server);
		sn = sn || __sn;
		utils.assert(fmtc, errno.ERR_NO_FMTC_INSTANCE);
		utils.assert(sn, errno.ERR_SN_IS_EMPTY);

		var res = this.response;
		var [statusCode,headers,data] = 
			await fmtc.client(sn).call('dmagic', [name,params,headers]);

		this.markResponse();

		for (var [key,val] of Object.entries(headers)) {
			res.setHeader(key, val);
		}
		res.writeHead(statusCode);
		res.end(data);
	}
}
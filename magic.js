/**
 * @copyright © 2018 Copyright dphoto.com
 * @date 2019-11-29
 */

var utils = require('somes').default;
var ctr = require('somes/ctr');
var fmt = require('somes/fmt').default;
var errno = require('./errno');

/**
 * @class MagicForward
*/
module.exports = class MagicForward extends ctr.ViewController {

	async index({__name, __sn, ...params }) {
		var { sn, ...headers } = this.headers;
		var fmtc = fmt.fmtc(this.server);
		sn = sn || __sn;
		utils.assert(fmtc, errno.ERR_NO_FMTC_INSTANCE);
		utils.assert(sn, errno.ERR_SN_IS_EMPTY);

		delete headers['content-type']; // application/json is used by default after deletion

		var res = this.response;
		var [statusCode,response_headers,data] = 
			await fmtc.client(sn).call('dmagic', [__name, params, headers]);

		this.markReturnInvalid();

		for (var [key,val] of Object.entries(response_headers)) {
			res.setHeader(key, val);
		}
		res.writeHead(statusCode);
		res.end(Buffer.from(data.buffer, data.byteOffset, data.byteLength));
	}
}
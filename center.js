/**
 * @copyright © 2018 Copyright dphoto.com
 * @date 2019-11-27
 */

var {FastMessageTransferCenter} = require('nxkit/fmt');

/**
 * @class Center
 */
class Center extends FastMessageTransferCenter {

	/**
	 * @overwrite
	 */
	fnodeAuth(fnodeRemoteService) {
		return true;
	}

	/**
	 * @overwrite
	 */
	clientAuth(fmtService) {
		// TODO ...
		return true;
	}

}

module.exports = Center;

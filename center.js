/**
 * @copyright © 2018 Copyright dphoto.com
 * @date 2019-11-27
 */

var keys = require('nxkit/keys');
var fs = require('fs');
var {
	FastMessageTransferCenter, 
	FastMessageTransferCenterDelegate} = require('nxkit/fmt');
const ADMIN_CACHE_TIME = 1e5; // 100s

/**
 * @class Delegate
 */
class Delegate extends FastMessageTransferCenterDelegate {

	constructor(...args) {
		super(...args);
		this.m_admin = {};
		this.m_adminTime = 0;
	}

	_readAdminInfo(id) {
		if (this.m_adminTime < Date.now()) {
			var s;
			if (fs.existsSync(__dirname + '/admin')) {
				s = __dirname + '/admin';
			} else if (fs.existsSync(__dirname + '/.admin')) {
				s = __dirname + '/.admin';
			}
			if (s) {
				this.m_admin = keys.parseFile(s);
				this.m_adminTime = Date.now();
			}
		}
		return this.m_admin[id];
	}

	authFnode(fnodeRemoteService) {
		// TODO ...
		return fnodeRemoteService.headers.certificate;
	}

	auth(fmtService) {
		var {certificate,role} = fmtService.headers;
		if (role == 'device') {
			// TODO auth device ...
			return certificate;
		} else if (role == 'admin') {
			var admin = this._readAdminInfo(fmtService.id);
			if (admin) {
				// TODO auth admin ...
				if (admin == certificate) {
					return true;
				}
			}
		}
		return false;
	}

}

/**
 * @class Center
 */
class Center extends FastMessageTransferCenter {
	constructor(...args) {
		super(...args);
		this.setDelegate(new Delegate());
	}
}

module.exports = Center;

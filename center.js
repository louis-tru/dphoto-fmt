/**
 * @copyright © 2018 Copyright dphoto.com
 * @date 2019-11-27
 */

const utils = require('nxkit');
const keys = require('nxkit/keys');
const fs = require('fs');
const { FastMessageTransferCenter, 
	FastMessageTransferCenterDelegate } = require('nxkit/fmt');
const ADMIN_CACHE_TIME = 1e5; // 100s
const mysql = require('nxkit/mysql');

/**
 * @class Delegate
 */
class Delegate extends FastMessageTransferCenterDelegate {

	constructor(...args) {
		super(...args);
		this.m_admin = {};
		this.m_adminTime = 0;
		this.m_db = new mysql.Mysql(utils.config.db);
	}

	_readAdminInfo(user) {
		if (this.m_adminTime < Date.now()) {
			var s;
			if (fs.existsSync(__dirname + '/admin')) {
				s = __dirname + '/admin';
			} else if (fs.existsSync(__dirname + '/.admin')) {
				s = __dirname + '/.admin';
			}
			if (s) {
				this.m_admin = keys.parseFile(s);
				this.m_adminTime = Date.now() + ADMIN_CACHE_TIME;
			}
		}
		return this.m_admin[user];
	}

	authFnode(fnodeRemoteService) { // TODO ...
		return fnodeRemoteService.headers.certificate;
	}

	async auth(fmtService) {
		var sn = fmtService.id;
		var {certificate,role,user} = fmtService.headers;
		if (role == 'device') {
			var [data] = await db.exec(
				`select * from ch_device where device_id = '${certificate}' and device_sn = '${sn}'`);
			if (data.rows.length) {
				return { role, user: sn };
			}
		} else if (role == 'admin') {
			var passwd = this._readAdminInfo(user);
			if (passwd) {
				// TODO auth admin ...
				if (passwd == certificate) {
					return { name: user, role };
				}
			}
		}
	}

	triggerTo(id, event, data, sender) {
		return super.triggerTo(id, event, data, sender);
	}

	callTo(id, method, data, timeout, sender) {
		return super.callTo(id, method, data, timeout, sender);
	}

	sendTo(id, method, data, sender) {
		return super.sendTo(id, method, data, sender);
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

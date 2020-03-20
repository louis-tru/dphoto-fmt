/**
 * @copyright © 2018 Copyright dphoto.com
 * @date 2019-11-27
 */

const utils = require('nxkit').default;
const keys = require('nxkit/keys').default;
const fs = require('fs');
const { FastMessageTransferCenter, 
	FastMessageTransferCenterDelegate } = require('nxkit/fmt');
const ADMIN_CACHE_TIME = 1e5; // 100s
const mysql = require('nxkit/mysql');
const crypto = require('crypto-tx');
const errno = require('./errno');

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
		// console.log(this.m_admin);
		return this.m_admin[user];
	}

	authFnode(fnodeRemoteService) { // TODO ...
		return fnodeRemoteService.headers.certificate;
	}

	async auth(fmtService) {
		var sn = fmtService.id;
		var {certificate,role,user,st,sign} = fmtService.headers;
		if (role == 'device') {
			try {
				var [data] = await this.m_db.exec(
					`select * from ch_device where device_id = '${certificate}' and device_sn = '${sn}'`);
			} catch(err) {
				console.log('Auth fail', err);
				throw err;
			}
			if (data.rows.length) {
				return { role, user: sn };
			} else {
				console.log(`device auth fail, sn=${sn}, id=${certificate}`);
			}
		} else if (role == 'admin') {
			var publicKey = this._readAdminInfo(user);
			if (publicKey) {
				st = Number(st) || 0;
				// utils.assert(Math.abs(Date.now() - st) < 3e4, errno.ERR_ILLEGAL_ACCESS);
				if (Math.abs(Date.now() - st) > 3e4) {
					console.log('ERR_ILLEGAL_ACCESS, date not match, Date.now() - st', Date.now() - st);
					throw Error.new(errno.ERR_ILLEGAL_ACCESS);
				}
				publicKey = Buffer.from(publicKey, 'hex');
				var key = 'a4dd53f2fefde37c07ac4824cf7086439633e1a357daacc3aaa16418275a9e40';
				var hash = Buffer.from(crypto.keccak(user + role + st + key).data);
				var sign = Buffer.from(sign, 'base64');
				// console.log('sign confirm dev', '0x'+ publicKey);
				if ( crypto.verify(hash, publicKey, sign.slice(0, 64)) ) {
					console.log('query mysql', fmtService.headers.thatid);
					var [data] = await this.m_db.exec(
						`select device_sn from ch_device where device_sn like '%${fmtService.headers.thatid}'`);
					console.log('query mysql ok', fmtService.headers.thatid);
					utils.assert(data.rows.length, 'cannot find device');
					return { name: user, role, fullThatId: data.rows[0].device_sn };
				} else {
					console.log('Auth admin fail', user, publicKey.toString('hex'));
				}
			} else {
				console.log('Auth admin fail, canot find user', user);
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
		new Delegate(this);
	}
}

module.exports = Center;

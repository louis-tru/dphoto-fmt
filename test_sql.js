/**
 * @copyright © 2018 Copyright dphoto.com
 * @date 2019-11-27
 */

const utils = require('somes').default;
const mysql = require('somes/mysql');

async function test() {
	var db = new mysql.Mysql(utils.config.db);
	var [data] = await db.exec(`SELECT * FROM ch_device where device_id = '152cc1279f7aba95' and device_sn = '152cc1279f7aba95'`);
	// var [data1] = await db.exec(`SELECT * FROM ch_device where device_id = '152cc1279f7aba95' and device_sn = '152cc1279f7aba95'`);
	// var [data2] = await db.exec(`SELECT * FROM ch_device where device_id = '152cc1279f7aba95' and device_sn = '152cc1279f7aba95'`);
	db.close();
	console.log(data.rows);
}

test();
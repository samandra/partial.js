var utils = require('../lib/utils');
var assert = require('assert');
var framework = require('../lib/index');
var http = require('http');

var url = 'http://127.0.0.1:8001/';
var errorStatus = 0;
var max = 100;

framework.init(http, false, 8001);

framework.onError = function(error, name, uri) {

	if (errorStatus === 0) {
		console.log(error, name, uri);
		framework.stop();
		return;
	}

	if (errorStatus === 1) {
		assert.ok(error.toString().indexOf('not found') !== -1, 'view: not found problem');
		errorStatus = 2;
		return;
	}

	if (errorStatus === 2) {
		assert.ok(error.toString().indexOf('not found') !== -1, 'template: not found problem');
		errorStatus = 3;
		return;
	}

	if (errorStatus === 3) {
		assert.ok(error.toString().indexOf('not found') !== -1, 'content: not found problem');
		errorStatus = 0;
		return;
	}
};

function end() {
	console.log('================================================');
	console.log('success - OK');
	console.log('================================================');
	console.log('');
	framework.stop();
}

function test_controller_functions(next) {
	utils.request(url, 'GET', null, function(error, data, code, headers) {
		
		if (error)
			assert.ok(false, 'test_controller_functions: ' + error.toString());

		assert.ok(code === 404, 'controller: statusCode ' + code);
		assert.ok(headers['etag'] === '123456:1', 'controller: setModified(etag)');
		assert.ok(headers['last-modified'].toString().indexOf('1984') !== -1, 'controller: setModified(date)');
		assert.ok(headers['expires'].toString().indexOf('1984') !== -1, 'controller: setExpires(date)');		
		next();
	});
}

function test_view_functions(next) {
	utils.request(url + 'views/', 'GET', null, function(error, data, code, headers) {

		if (error)
			assert.ok(false, 'test_view_functions: ' + error.toString());

		assert.ok(data === '{"r":true}', 'json');
		next();
	});
};

function test_view_error(next) {
	errorStatus = 1;
	utils.request(url + 'view-notfound/', 'GET', null, function(error, data, code, headers) {

		if (error)
			assert.ok(false, 'test_view_error: ' + error.toString());

		next();
	});	
}

function run() {

	if (max <= 0) {
		end();
		return;
	}

	max--;
	test_controller_functions(function() {
		test_view_functions(function() {
			test_view_error(function() {
				run();
			});
		});
	});	
}

setTimeout(function() {
	run();
}, 500);
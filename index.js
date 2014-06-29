#!/usr/bin/env node
var server = function(){
	this.__proto__.init = function(){
		var app = require('./app.js');
		app.db.init();		
	}
}
new server().init()
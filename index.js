#!/usr/bin/env node
var server = function(){
	this.__proto__.init = function(){
		var app = require('./app.js');
		app.db.init({
			onsuccess: function(){
				app.setRoutes();
				app.listen(app.config.site.listen_port);
				console.log("Listening to port: " + app.config.site.listen_port);
			},
			onerror: function(e){
				console.log("Error initializing database", e);
			},
			scope: app,
			config: app.config
		});		
	}
}
new server().init()
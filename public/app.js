Ext.onReady(function(){
	Ext.Loader.setConfig({
      	enabled: true
    });
    Ext.application({
    	name: 'App',
   	 	requires: [
        	'Ext.app.*',
        	'App.*'
    	],    
    	extend: 'App.Application'
    });
});
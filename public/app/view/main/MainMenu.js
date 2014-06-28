Ext.define("App.view.main.MainMenu", { 
	requires:[
		'App.store.MainMenu'
	],   
    extend: "Ext.view.View",
    xtype: "mainmenu",
    cls: "thumbnails",
    reference: "contentView",
    region: "center",
    store: "MainMenu",
    itemSelector: ".thumbnail-item",
    initComponent: function() {
        var b = {
            crisp: "border-circle",
            "crisp-touch": "circle",
            /* Custom */
            // neptune: "border-square",
            // "neptune-touch": "square",
            neptune: "border-circle",
            "neptune-touch": "circle",
            classic: "rounded-square",
            gray: "rounded-square"
        };
        this.tpl = '<tpl for=".">' +
        				'<div class="thumbnail-item">' +
        					'<div class="thumbnail-icon-wrap icon-' + b[Ext.themeName] +'">' +
        						'<div class="thumbnail-icon icon-{id}"></div>' +
        					'</div>' +
        					'<div class="thumbnail-text">{text}</div>' +
        				'</div>' +
        			'</tpl>';
        this.callParent();
    }
});
Ext.define("App.view.main.MainController", {
    extend: "Ext.app.ViewController",
    alias: "controller.main",
    applyState: function(c) {
        if (c.hasTreeNav) {
            this.getView().add({
                region: "west",
                reference: "tree",
                xtype: "navigation-tree"
            });
            var d = this.getReferences();
            d.contentPanel.header.hidden = false;
            this._hasTreeNav = true;
        } else {
            this._hasTreeNav = false;
        }
    },
    getState: function() {
        return {
            hasTreeNav: this._hasTreeNav
        };
    },
    showBreadcrumbNav: function() {
        var reference = this.getReferences()
        var breadcrumb = reference.breadcrumb;
        var tree = reference.tree;
        var selected = e = tree.getSelectionModel().getSelection()[0];
        window.count = tree;
        if (tree.getStore().count() == 0) {
            return;
        }
        if (breadcrumb) {
            breadcrumb.show();
        } else {
            reference.contentPanel.addDocked({
                xtype: "navigation-breadcrumb",
                selection: selected
            });
        }
        reference["breadcrumb.toolbar"].setSelection(selected);
        tree.hide();
        reference.contentPanel.getHeader().hide();
        this._hasTreeNav = false;
        this.getView().saveState();
    },
    showTreeNav: function() {
        var reference = this.getReferences();
        var tree = reference.tree;
        var breadcrumb = reference.breadcrumb;
        if (breadcrumb._breadcrumbBar.getStore().count() == 0) {
            return;
        }
        if (tree) {
            tree.show();
        } else {
            tree = this.getView().add({
                region: "west",
                reference: "tree",
                xtype: "navigation-tree"
            });
        }
        tree.getSelectionModel().select([ reference["breadcrumb.toolbar"].getSelection() ]);
        breadcrumb.hide();
        reference.contentPanel.getHeader().show();
        this._hasTreeNav = true;
        this.getView().saveState();
    }
});

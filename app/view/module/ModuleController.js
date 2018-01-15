Ext.define('SSJT.view.module.ModuleController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.module',
    /**
     * Called when the view is created
     */
    init: function () {},

    onTapItem(dv, location) {
        const record = location.record;
        if(!record) return;

        const id = record.get('id'),
            prefixes = Pkg4Route.prefixes;

        if(prefixes.hasOwnProperty(id)) {
            const route = prefixes[id][2];
            if(!Ext.isEmpty(route)) {
                Utils.redirectTo(route);
            }
        }
    }
});
Ext.define('SSJT.view.grid.Grid', {
    extend:'Ext.grid.Grid',
    xtype:'ssjt_grid',
    config:{
        rowResize:true,
    },
    rowNumbers:{
        resizable:false,
        xtype:'ssjt_rownumberercolumn'
    },
    hasRowResizingCls: Ext.baseCSSPrefix + 'has-rowresizing',
    getTemplate: function() {
        var me = this,
            template = me.callParent();
        template.push({
            reference: 'hResizeMarkerElement',
            className: Ext.baseCSSPrefix+'horizontal-resize-marker-el',
            hidden: true
        });

        return template;
    },
    updateRowResize(value, oldValue) {
        const me = this;
        if(value) {
            me.addCls(me.hasRowResizingCls);
        }else {
            me.removeCls(me.hasRowResizingCls);
        }
    }
});
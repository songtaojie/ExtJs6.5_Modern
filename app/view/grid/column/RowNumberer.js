Ext.define('SSJT.view.grid.column.RowNumberer', {
    extend:'Ext.grid.column.RowNumberer',
    xtype:[
        'ssjt_rownumberercolumn',
        'ssjt_rownumberer'
    ],
    cell:{
        xtype:'ssjt_rownumberercell'
    }
});
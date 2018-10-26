Ext.define('SSJT.view.book.balances.Balances',{
    extend:'Ext.Panel',
    xtype:'balances',
    layout:'fit',
    tbar:{
        xtype: 'toolbar',
        //userCls: 'top-bar', 
        items:[{
            xtype:'selectfield',
            name:'DisplayFormat',
            //role:'type',
            //width:143,
            labelWidth:65,
            width:180,
            label:'显示格式',
            placeholder:'显示格式',
            editable: false,
            //clearable: false,
            //picker: 'floated',
            options: [{
                value: 'mine',
                text: '本币金额式'
            }, {
                value: 'mineManager',
                text: '本币数量式'
            }, {
                value: 'mineCollaborate',
                text: '外币金额式'
            }, {
                value: 'mineCreate',
                text: '外币数量式'
            }],
            value: 'mine',
        }]
    },
    items:[{
        xtype:'balances_table'
    }]
})
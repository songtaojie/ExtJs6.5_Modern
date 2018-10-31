Ext.define('SSJT.view.report.FunDialog', {
    extend:'Ext.Dialog',
    referenceHolder: true,

    closable: true,
    closeAction: 'hide',

    hidden: true,

    maxWidth: '100vw',
    maxHeight: '100vh',

    platformConfig: {
        phone: {
            width: '100vw',
            height: '100vh'
        },
        '!phone': {
            width: 900,
            height: '90vh'
        }
    },
    items:[{
        xtype:'selectfield',
        options:[{
            value:1,
            text:'常用函数'
        },{
            value:2,
            text:'通用函数'
        }]
    }]
});
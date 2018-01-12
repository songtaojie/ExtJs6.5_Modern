Ext.define('SSJT.view.login.Login',{
    extend:'Ext.Container',
    requires:[
        'SSJT.view.login.LoginController'
    ],
    xtype:'login',
    controller:'login',
    cls:'login',
    layout:{
        type:'vbox',
        align:'center',
        pack:'center'
    },
    items:[{
        cls:'login-header',
        html:
            '<span class="logo x-fa fa-circle-o-notch">'+
            '<div class="title">SSJT</div>'+
            '<div class="caption">练习</div>'
    },{
        xtype:'formpanel',
        reference:'loginform',
        layout:'vbox',
        ui:'loginForm',
        items: [{
            xtype: 'textfield',
            name: 'username',
            placeholder: '用户名',
            required: true
        }, {
            xtype: 'passwordfield',
            name: 'password',
            placeholder: '密码',
            required: true
        }, {
            xtype: 'button',
            text: '登录',
            iconAlign: 'right',
            iconCls: 'x-fa fa-angle-right',
            handler: 'onLoginClick',
            ui: 'action'
        }]
    },{
        xtype:'component',
        cls:'login-footer',
        html:
            '<div>Crm</div>'+
            '<a href="http://www.baidu.com" target="_balnk">'+
                '<span class="logo ext ext-sencha"></span>'+
                '<span class="label">Crm</span>'+
            '</a>'
    }],
})
Ext.define('SSJT.view.login.LoginController',{
    extend:'Ext.app.ViewController',
    alias:'controller.login',
    init:function(){
        var me = this;
        this.callParent(arguments);
        var map = new Ext.util.KeyMap({
            target: "my-element",
            key: 13, // or Ext.event.Event.ENTER
            handler: onLoginClick,
            scope: me
        });
    },
    onLoginClick:function(){
    //     localStorage.setItem('LoginStatus',true);
    //     this.getView().destroy();
    //    Ext.create({
    //         xtype:'app-main'
    //     });
        // var me = this,
        // btnLogin = me.lookup('btnLogin'),
        // form = me.lookup('form');

        // form.clearErrors();
        // me.fireEvent("login",session);
    },
    onCancelClick:function(){
        this.getView().hide();
    }
});
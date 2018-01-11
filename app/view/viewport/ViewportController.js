Ext.define('SSJT.view.viewport.ViewportController',{
    extend:'Ext.app.ViewController',
    alias:'controller.viewport',
    listen:{
        controller:{
            '*':{
                unmatchedroute:'handleUnmatchedRoute'
            }
        }
    },
    routes:{
        'login':'handleLoginRoute'
    },
    onLaunch:function(){
        this.originalRoute = SSJT.getApplication().getDefaultToken();
    },
    handleUnmatchedRoute:function(route){
        var me = this;
        if(!me.session||!me.session.isValid()){
            me.originalRoute = route;
            me.redirectTo('login',{replace:true});
            return;
        }
        var target = SSjt.getApplication().getDefaultToken();
        Ext.log.warn('Route unknown ' + route);
        if(route!==target){
            me.redirectTo(target,{replace:true});
        }
        
    },
    handleLoginRoute:function(){
        var session = this.session;
        if(session&&session.isValid()){
            this.redirectTo('',{required:true});
            return;
        }
        this.showLoginView();
    },
    showView:function(xtype){
        var view = this.lookup(xtype),
            viewport = this.getView();
        if(!view){
            viewport.removeAll(true);
            viewport.add({
                xtype:xtype,
                reference:xtype
            });
        }
        viewport.setActiveItem(view);
    },
    showLoginView:function(){
        this.showView('login');
    }
});
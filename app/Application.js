/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('SSJT.Application', {
    extend: 'Ext.app.Application',

    name: 'SSJT',

    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },
    defaultToken:'home',
    viewport: {
        controller: 'viewport',
        viewModel: 'viewport'
    },
     /**
     * 随 ajax 请求一起传递到后台的一些额外数据
     * @return {Object}
     */
    getClientInfo() {
        return null;
    },
    launch:function(profile){
        const me = this;

        Ext.enableAria = false;
        Ext.ariaWarn = Ext.emptyFn;

        Ext.event.gesture.LongPress.instance.setMinDuration(600); // 长按延时设为 600ms

        // 默认时间格式
        Ext.apply(Ext.Date, {
            defaultTimeFormat: 'H:i'
        });

        // 去除 Ext.Msg 动画
        // Ext.Msg.defaultAllowedConfig.hideAnimation = null;
        // Ext.Msg.defaultAllowedConfig.showAnimation = null;
       
        // ajax 请求的主机地址（域名和端口等）
        if (Utils.isDev) { //development
            Config.httpUrl = Config.devHttpUrl;
        } else { // production
            if (Utils.isWeb) { // http
                Config.httpUrl = Config.relativeHttpUrl;
            } else {
                Config.httpUrl = Config.prodHttpUrl;
            }
        }
        // The viewport controller requires xtype defined by profiles, so let's perform extra
        // initialization when the application and its dependencies are fully accessible.
        Ext.Viewport.getController().onLaunch();
        me.callParent([profile]);
    },
    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});

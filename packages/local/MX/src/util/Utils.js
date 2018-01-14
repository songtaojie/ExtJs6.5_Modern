/**
 * 通用帮助类
 * 
 */
Ext.define('MX.util.Utils',{
    alternateClassName:'Utils',
    singleton:true,
    requires:[
        'Ext.Toast',
        'Ext.MessageBox'
    ],
     /**
     * 常用正则
     */
    regex: {
        url: /^(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-/]))?$/i
    },
    /**
     * 常用正则, 字符串形式
     */
    regexStr: {
        query: '((\\?(?:&?[^=&]*=[^=&]*)*)?)', // 可以匹配 空字符串、?、?DocEntry=30000
        query2: '(\\?(?:&?[^=&]*=[^=&]*)*)' // 可以匹配 ?、?DocEntry=30000
    },
    /**
     * 当前是否是开发模式
     * @property {Boolean}
     */
    isDev:Ext.manifest.env==='development',
    /**
     * 当前是否是Web访问
     * @property {Boolean}
     */
    isWeb:location.href.indexOf('http')==0,
    /**
     * 获取当前应用程序
     * @returns {Ext.app.application}
     */
    getApp(){
        return Ext.getApplication()||Ext.route.Router.application;
    },
    /**
     * 获取当前应用程序的名称
     * @returns {string}
     */
    getAppName(){
        return this.getApp().getName();
    },

    /*************LocalStorage操作******************** */
    /*****************
     * 获取LocalStorage中存储的key前面加上<AppName>-
     * @param {String} key
     * @returns {String} <AppName>-key
     */
    getLsKey(key){
        if(Ext.isEmpty(key))return '';
        return `${this.getAppName()}-${key}`;
    },
    /**
     * 根据key获取localStorage的值
     * @param {*String} key 
     * @returns {String} value值
     */
    getLsItem(key){
        return localStorage.getItem(this.getLsKey(key));
    },
    /**
     * 设置localStorge的值
     * @param {*String} key 键
     * @param {*String} value 值
     */
    setLsItem(key,value){
        localStorage.setItem(this.getLsKey(key),value);
    },
    /**
     * 根据key删除localStorage存储的值
     * @param {String} key 
     */
    removeLsItem(key){
        localStorage.removeItem(this.getLsKey(key));
    },
    /*************路由操作*************** */
    /**
     * url跳转
     */
    redirectTo(){
        const app = this.getApp();
        if(app){
            app.redirectTo.apply(app,arguments);
        }
    },
    /** 
     * 修改了当前的历史记录项
     * @param {String} hash 
    */
    replaceState(hash){
        if(history.replaceState){
            history.replaceState(null,'',hash);
        }
    },
    /**
     * 静默转向hash地址，不触发路由处理函数
     * @param {String} hash 
     */
    redirectToSilently(hash){
        if(history.pushState){
            const me = this,
                oldToken = Ext.History.getToken();
                token = hash2Token(hash);
            history.pushState(null,'',token2Hash(token));
            Ext.History.hash = token;
            Ext.route.Router.clearLastTokens(oldToken);
            Ext.fireEvent('afterroute',null,token);
        }
    },
    /**
     * #login-->login
     * @param {String} hash 
     */
    hash2Token(hash){
        return (hash||'').replace(Ext.History.hashRe,'');
    },
    token2Hash(token){
        return token.replace(Ext.History.hashRe,Ext.History.hashbang?'#!':'#');
    },
    /**
     * 消息提示
     * @param {String} msg 
     */
    alert(msg){
        const message = (msg||'').replace(/(?:<style.*?>)((\n|\r|.)*?)(?:<\/style>)/ig,'');
        if(Ext.isEmpty(message))Ext.Msg.alert('系统提示',message);
    },
    ajax(api,options){
        if(arguments.length==0){
            alert('参数解析错误!');
            return;
        }
        _handlerOptions(options);
        if(options.maskTarget){
            this.mask(options.maskTarget);
        }
    },
    _handlerOptions(options){
        const me = this;
        options = options||{};
        //遮罩层
        if(options.maskTarget){
            if(options.maskTarget==true){
                options.maskTarget = Ext.Viewport
            }else if(Ext.isString(options.maskTarget)){
                options.maskTarget = this.getCmp(options.maskTarget);
            }
        }
        if(options.button){
            const btns=[],me = this;
            let bs = options.button;
            bs = Ext.isArray(bs)?bs:[bs];
            for(let i = 0;i<bs.length;i++){
                let b = bs[i];
                if(Ext.isEmpty(b))continue;
                btns.push(Ext.isString(b)?Ext.getCmp(b):b);
            }
            if(btns.length>0){
                options.button = btns;
            }else{
                delete options.button
            }
        }
        if(options.data){
            options.params = Ext.apply({},options.params,{
                data:Ext.encode(options.data)
            });
            delete options.data;
        }
        options.params = Ext.applyIf({},options.params,this.getApp().getClientInfo());

        // 此ajax请求所关联的component控件，使得控件在destroy时可以abort终止该请求
        if (!options.ajaxHost || !options.ajaxHost.isComponent || options.ajaxHost.isDestroying) {
            delete options.ajaxHost;
        }

        return options;
    },
    /**
     * 
     * @param {Ext.component} view 视图或者空间
     * @param {*} msg 遮罩层提示信息
     */
    mask(view,msg){
        const me = this;
        const  message = msg||'';
        if(view&&!view.isDestroyed){
            const mask = me.getLoadMask(message);
        }
    },
    getLoadMask(msg){
        var mask = this.getCmp('loadmask',true);
        
    },
    /**
     * 根据小type获取组件
     * @param {String} xtype 
     * @param {Boolean} exact 明确查找xtype。若为false，表示任何继承自xtype的组件都会被找到；否则，只找顶层类型为xtype的组件
     * @returns {Ext.Component}
     */
    getCmp(xtype,exact){
        if(exact===undefined)exact = true;
        const cmps = Ext.ComponentQuery.query(xtype+exact?'(true)':'');
        return cmps>=1?cmps[0]:null;
    }
});
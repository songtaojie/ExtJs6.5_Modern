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
     * @param {*String} key 
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
    }

});
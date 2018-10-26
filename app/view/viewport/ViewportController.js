Ext.define('SSJT.view.viewport.ViewportController', {
        extend: 'Ext.app.ViewController',
        alias: 'controller.viewport',
    
        requires: [
            'Ext.Package',
    
            'SSJT.view.pages.Error404',
            'SSJT.view.login.Login',
            'SSJT.view.module.Module',
        ],
    
        listen: {
            controller: {
                '*': {
                    needlogin: 'onNeedLogin',
                    login: 'onLogin',
                    logout: 'onLogout',
                    userchanged: 'onUserChanged'
                }
            },
            global: {
                beforeroute: 'onBeforeRoute',
                afterroute: 'onAfterRoute',
                unmatchedroute: 'handleUnmatchedRoute'
            }
        },
    
        routes: {
            'login': 'showAuth',
            'login/returnurl/:url': 'showAuth',
            'module': 'showModule',
        },
    
        onLaunch() {
            var me = this;
            me.showModule();
            // 暂停路由跳转
            // 先检查用户是否登录(session)
            // Ext.route.Router.suspend();
    
            // Utils.ajax('OA.UserAuth/CurrentUserInfo', {
            //     success(r) {
            //         console.log('已经是登录状态', r);
            //         me.onUser(r);
            //     },
            //     callback() {
            //         Ext.getBody().removeCls('launching');
            //     },
            //     maskTarget: false
            // });
        },
    
        /**
         * 寻找已经存在的 xtype 的 view 实例
         * @param {String} xtype
         */
        existedView(xtype) {
            const view = this.lookup(xtype);
    
            return view;
        },
        showView(xtype) {
            const me = this,
                viewport = me.getView();
            let view = me.existedView(xtype);
            if (!view) {
                viewport.removeAll(true);
                view = viewport.add({
                    xtype: xtype,
                    reference: xtype
                });
    
                var token = Ext.History.getToken();
                if (!Ext.isEmpty(token)) {
                    me.redirectTo(token, {
                        force: true
                    });
                }
            }
    
            viewport.setActiveItem(view);
    
            return view;
        },
    
        showChartDesign() {
            debugger;
            const me = this,
                viewport = me.getView();
    
            // let view = me.existedView('chartdesign');
            // if (!view) {
            viewport.removeAll(true);
            view = viewport.add({
                xtype: 'chartdesign',
    
            });
    
            // var token = Ext.History.getToken();
            // if (!Ext.isEmpty(token)) {
            //     me.redirectTo(token, {
            //         force: true
            //     });
            // }
            //}
    
            viewport.setActiveItem(view);
    
            return view;
        },
        showAuth() {
            this.showView('authlogin');
        },
    
        showModule() {
            this.showView('flexible-selection-grid');
        },
    
        // ROUTING
    
        // 全局路由的 after 事件处理 (MX.override.route.Route)
        onAfterRoute(route, token, silent) {
            // 执行 上一个路由对象 的 exit 处理函数
            // 比如 路由跳转的时候，弹出的 新增/编辑 界面，需要隐藏
            const lastRoute = window._last_route,
                newRoute = route ? route : Utils.getRouteByToken(token);
            if (!silent && lastRoute && lastRoute !== newRoute) {
                const handlers = lastRoute.getHandlers(),
                    length = handlers.length;
                if (length) {
                    let i, handler, scope;
                    for (i = 0; i < length; i++) {
                        handler = handlers[i];
                        scope = handler.scope;
                        if (handler.exit) { // 如果 route 存在 exit 处理函数
                            Ext.callback(handler.exit, scope, [lastRoute, newRoute]);
                        }
                    }
                }
            }
            // 缓存下刚刚执行的路由
            window._last_route = newRoute;
            window._last_token = token;
    
            if (!RouteFloated.stack.length) {
                RouteFloated.tokenBeforeFloated = token;
            }
        },
    
        // 全局路由的 before 事件处理
        onBeforeRoute(action, route) {
            const me = this,
                lastView = me.lastView;
    
            if (lastView) {
                if (lastView instanceof Ext.Sheet) { // 如果上次的view是Ext.Sheet，就隐藏
                    lastView.hide();
                }
            }
            /* else {
                if (route !== window._last_route) {
                    Utils.backAllFloated(); // 隐藏所有悬浮层
                }
            }*/
    
            me.ensurePackageLoaded(route.lastToken);
        },
    
        /**
         * 未匹配到路由
         * 初次未匹配到 token 可能是 业务模块 package 还没加载，所以要先确保 package 已加载
         * 加载 package 完毕后，如果还是没有匹配到，就创建 业务模块的 Main 容器，检查 MainController 是否注册了满足 token 的路由
         * 如果还没有，就显示 404
         * @param {String} token
         */
        handleUnmatchedRoute(token) {
            const me = this;
    
            me.ensurePackageLoaded(token, xtype => { // 包之前已经加载过
                const view = me.existedView(xtype); // 如果 main 容器已存在
                if (view) { // 全局路由 和 MainController 中的路由已经都注册过，但还是未匹配到路由
                    me.show404Page(); // 就显示 404
                } else {
                    me.showMainAndCheckRoute(xtype, token); // 否则创建 Main，再检查 MainController 中的路由
                }
            }, xtype => { // 包加载成功
                if (!Utils.getRouteByToken(token)) { // 如果没有全局路由
                    me.showMainAndCheckRoute(xtype, token); // 就创建 Main，再检查 MainController 中的路由
                } else {
                    me.redirectTo(token, { // 有路由就直接转向
                        force: true
                    });
                }
            });
        },
    
        /**
         * 显示 Main 容器之后，在判断 route 是否有效
         * 有效就转向，无效就显示 404
         * @param {String} xtype Main 容器的 xtype
         * @param {String} token 要转向的 url
         */
        showMainAndCheckRoute(xtype, token) {
            const me = this,
                main = me.showView(xtype);
    
            if (Utils.getRouteByToken(token, main.getController())) {
                me.redirectTo(token, {
                    force: true
                });
            } else {
                me.show404Page();
            }
        },
    
        /**
         * 确保路由对应的模块 Package 已经加载
         * @param {String} url
         * @param {Function} callbackIfLoaded 如果 Package 之前已经是加载过了, 则调用此回调
         * @param {Function} callbackIfNotLoaded 如果 Package 原先未加载，此次加载成功, 则调用此回调
         */
        ensurePackageLoaded(url, callbackIfLoaded, callbackIfNotLoaded) {
            const me = this,
                view = me.getView();
    
            if (!Ext.isEmpty(url)) {
                const routePrefix = url.split('/')[0];
    
                if (Pkg4Route.prefixes.hasOwnProperty(routePrefix)) {
                    const arr = Pkg4Route.prefixes[routePrefix],
                        pkg = arr[0], // 包
                        xtype = arr[1]; // 包中 Main 容器 的 xtype
    
                    if (!pkg || Ext.Package.isLoaded(pkg)) {
    
                        me.registerRouteController(pkg);
    
                        if (callbackIfLoaded) callbackIfLoaded(xtype);
                    } else {
                        Ext.route.Router.suspend(); // 暂停路由跳转
    
                        Utils.mask(view, '正在加载模块...');
    
                        Ext.Package.load(pkg).then(() => {
    
                            me.registerRouteController(pkg);
    
                            Utils.unMask(view);
    
                            Ext.route.Router.resume(); // 恢复路由
    
                            if (callbackIfNotLoaded) callbackIfNotLoaded(xtype);
                        }).catch(ex => {
                            console.error(ex);
                        });
                    }
                } else {
                    if (callbackIfLoaded) callbackIfLoaded();
                }
            }
        },
    
        /**
         * 注册 业务模块的 路由 全局 Controller（如果有这个类）
         * @param {String} pkg 包名/Namespace
         */
        registerRouteController(pkg) {
            if (!pkg) return;
    
            const className = `${pkg}.controller.Route`;
            if (Ext.ClassManager.get(className)) {
                Utils.getApp().getController(className);
            }
        },
    
        /**
         * 显示 404 界面
         *
         * @param {String} token
         */
        show404Page(token) {
            const me = this;
    
            delete window._last_route;
            window._last_token = token; // 记录下刚刚的路由
    
            if (me.lastView && !me.lastView.isDestroyed && me.lastView.xtype == 'page404') return;
    
            const errPage = Ext.Viewport.add({
                xtype: 'page404'
            });
            me.lastView = errPage;
            errPage.on({
                destroy() {
                    delete this.lastView;
                },
                scope: me
            });
            errPage.show();
        },
    
    
        // AUTHENTICATION
        onLogin(user) {
            var me = this,
                token = Ext.History.getToken(), //当前地址栏token
                newToken = '';
    
            User.setUser(user);
    
            if (Ext.String.startsWith(token, 'login/returnurl/')) { //有returnurl参数，则转到returnurl
                newToken = decodeURIComponent(token.substr(16));
            } else if (!Ext.isEmpty(token) && token != 'login') {
                newToken = token;
            }
    
            if (Ext.isEmpty(newToken)) {
                newToken = Utils.getApp().getDefaultToken();
            }
    
            me.redirectTo(newToken, {
                replace: true,
                force: true
            });
        },
    
        onLogout() {
            var me = this,
                view = me.getView();
    
            Utils.ajax('OA.UserAuth/Logout', {
                success(r) {
    
                    me.clearUserData();
                    me.redirectTo('login', {
                        replace: true
                    });
                },
                maskTarget: view
            });
        },
    
        onNeedLogin() {
            var me = this,
                token = Ext.History.getToken(),
                newToken;
    
            if (!Ext.isEmpty(token) && !Ext.String.startsWith(token, 'login')) { //需要登录才可跳转，则带上要跳转到的token
                newToken = 'login/returnurl/' + encodeURIComponent(token);
            } else {
                newToken = 'login';
            }
    
            me.clearUserData();
            me.redirectTo(newToken, {
                replace: true,
                force: true
            });
        },
    
        clearUserData() {
            User.setUser(null);
        },
    
        onUser(user) {
            User.setUser(user);
    
            // 恢复路由
            Ext.route.Router.resume();
        },
    
        /**
         * 在用户变更（注销）时 做一些清理工作
         */
        onUserChanged() {
            // 清除缓存
            delete AbstractHome.settingCache;
            delete AbstractHome.homeListCache;
        }
    });
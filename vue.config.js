const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
module.exports = {
    publicPath: "/",
    configureWebpack: config => {
        if (IS_PROD) {
            config.externals = {
                vue: "Vue",
                Vuex: 'Vuex',
                "vue-router": "VueRouter",
                axios: "axios",
                'element-ui': 'ELEMENT',
                "js-cookie": "Cookies",
            };
        }
    },
    chainWebpack: config => {
        const cdn = IS_PROD ? {
            css: [
            ],
            js: [
                "https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js",
                "https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.js",
                "https://unpkg.com/vue-router/dist/vue-router.min.js",
                "https://unpkg.com/vuex",
                "https://unpkg.com/axios@0.21.1/dist/axios.min.js",
                "https://unpkg.com/element-ui/lib/index.js",
                "https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js",
            ]
        } : {};
        config.plugin("html").tap(args => {
            args[0].cdn = cdn;
            args[0].title = "LUFUHU | 速查表";
            return args;
        });
        // 修复HMR
        config.resolve.symlinks(true);
    }
};
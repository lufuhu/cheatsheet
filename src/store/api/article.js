export default {
    homeData: {
        url: '/home/index',
        method: 'GET',
        cache:true,
    },
    loginOut: {
        url: '/loginout',
        method: 'POST',
        cache:true,
    },
    articleGetSelect: {
        url: '/home/article/get_select_data',
        method: 'GET',
        cache:true,
    },
    articleGetEnum: {
        url: '/home/article/get_enum',
        method: 'GET',
        cache:true,
    },
    articleView: {
        url: '/home/article/article/{id}',
        method: 'GET',
    },
    articleList: {
        url: '/home/article/article',
        method: 'GET',
        cache:true,
    },
    articleAdd: {
        url: '/home/article/article',
        method: 'POST',
    },
    articleEdit: {
        url: '/home/article/article/{id}',
        method: 'POST'
    },
    articleDel: {
        url: '/home/article/article/{id}',
        method: 'DELETE'
    },
}
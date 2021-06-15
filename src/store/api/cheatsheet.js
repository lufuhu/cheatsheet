export default {
    cheatsheetList: {
        url: '/cheatsheet/cheatsheet',
        method: 'GET',
    },
    cheatsheetAdd: {
        url: '/cheatsheet/cheatsheet',
        method: 'POST',
    },
    cheatsheetEdit: {
        url: '/cheatsheet/cheatsheet/{id}',
        method: 'POST'
    },
    cheatsheetDel: {
        url: '/cheatsheet/cheatsheet/{id}',
        method: 'DELETE'
    },
    cheatsheetBuild: {
        url: '/cheatsheet/build/{id}',
        method: 'POST'
    },
}
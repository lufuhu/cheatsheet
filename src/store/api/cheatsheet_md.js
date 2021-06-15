export default {
    cheatsheetMdList: {
        url: '/cheatsheet/cheatsheet_md/{pid}',
        method: 'GET',
    },
    cheatsheetMdView: {
        url: '/cheatsheet/cheatsheet_md/{pid}/{id}',
        method: 'GET',
    },
    cheatsheetMdAdd: {
        url: '/cheatsheet/cheatsheet_md',
        method: 'POST',
    },
    cheatsheetMdEdit: {
        url: '/cheatsheet/cheatsheet_md/{id}',
        method: 'POST'
    },
    cheatsheetMdDel: {
        url: '/cheatsheet/cheatsheet_md/{id}',
        method: 'DELETE'
    },
}
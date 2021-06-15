import api from '../api/index';
import request from '../../utils/http'

const state = {};
const getters = {};
const mutations = {};
const actions = {};
Object.keys(api).forEach(function (key) {
    state[key] = {}
    getters[key + 'Data'] = function (state) {
        return state[key]
    }
    mutations[key] = function (state, params) {
        request(api[key], params).then((res)=>{
            state[key] = res;
        })
    }
    actions[key] = function ({commit}, params) {
        commit(key, params)
    }
})
export default {
    state, getters, mutations, actions
}
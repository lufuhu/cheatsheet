import axios from "axios";
import qs from "qs";
import Cookies from "js-cookie";
import localforage from 'localforage';
import { Message } from 'element-ui';
import store from '../store'

const baseURL = process.env.NODE_ENV === "production" ? "/api/v1" : "http://www.api.local/api/v1"

/**
 * axios发起请求
 * @param config
 * @param params
 * @returns {Promise<unknown>}
 */
export default function (storeKey, config, data = {}) {
    let url = config.url, fromData = {}
    let cache = false;
    if (data.cache !== undefined) {
        cache = data.cache
    } else if(config.cache !== undefined){
        cache = config.cache
    }
    config.method = config.method ? config.method : "GET"
    if (data) {
        for (let key in data) {
            url = url.replace('{' + key + '}', data[key]);
        }
        if (config.method === 'GET') {
            url += '?' + qs.stringify(data)
        } else {
            fromData = qs.stringify(data);
        }
    }
    let httpConfig = {
        method: config.method,
        baseURL: baseURL,
        url: url,
        data: fromData,
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Authorization': Cookies.get('token')
        },
    }
    return new Promise((resolve, reject) => {
        if (cache) {
            localforage.getItem(url).then(function (value) {
                if (value) {
                    store.state.api[storeKey] = value
                    return resolve(value)
                }
            });
        }
        axios(httpConfig).then((res) => {
            if (res.data.status !== 1){
                Message({
                    type: 'error',
                    message: res.data.message,
                });
                return;
            }
            if (config.cache) {
                localforage.setItem(url, res.data)
            }
            store.state.api[storeKey] = res.data
            return resolve(res.data)
        }).catch((response) => {
            reject(response)
        })
    })
}
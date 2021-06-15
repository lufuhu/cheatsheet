import axios from "axios";
import qs from "qs";
import Cookies from "js-cookie";
import { Message } from 'element-ui';

const baseURL = process.env.NODE_ENV === "production" ? "/api/v1" : "http://www.api.local/api/v1"

/**
 * axios发起请求
 * @param config
 * @param params
 * @returns {Promise<unknown>}
 */
export default function (config, data = {}) {
    let url = config.url, fromData = {}
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
        axios(httpConfig).then((res) => {
            if (res.data.status !== 1){
                Message({
                    type: 'error',
                    message: res.data.message,
                });
                return;
            }
            return resolve(res.data)
        }).catch((response) => {
            reject(response)
        })
    })
}
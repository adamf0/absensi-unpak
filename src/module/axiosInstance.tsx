import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.base_url_api
});

instance.interceptors.request.use(config => {
    // const authData = localStorage.getItem('authData');
    // if (authData && authData !== "null") {
    //     config.headers['Authorization'] = authData;
    // }

    // if (config.data instanceof Object) {
    //     config.headers['Content-Type'] = 'application/json';
    // } else {
        // config.headers['Content-Type'] = 'multipart/form-data';
    // }
    config.headers['Content-Type'] = config.data instanceof FormData? "multipart/form-data":"application/json";
    config.headers['Access-Control-Allow-Origin'] = '*';
    if (config.method?.toLowerCase() === 'post') {
        config.params = {
          ...config.params,
          '_': new Date().getTime(),
        };
    }
    return config;
});

instance.interceptors.response.use(response => {
    if (response.config.method?.toLowerCase() === 'post') {
        const requestId = response.config.url;
        if (requestId) {
          console.log(`Cache entry removed for request ID: ${requestId}`);
        }
    }

    return response.data;
}, error => {
    if (error.response) {
        return Promise.reject(error.response.data);
    } else if (error.request) {
        return Promise.reject({ message: "Tidak ada tanggapan dari server." });
    } else {
        return Promise.reject({ message: "Permintaan gagal dikirim." });
    }
});

export default instance;
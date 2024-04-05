import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.base_url_api
});

instance.interceptors.request.use(config => {
    // const authData = localStorage.getItem('authData');
    // if (authData && authData !== "null") {
    //     config.headers['Authorization'] = authData;
    // }
    config.headers['Content-Type'] = 'multipart/form-data';
    config.headers['Accept'] = 'application/json';
    config.headers['Access-Control-Allow-Origin'] = '*';
    return config;
});

instance.interceptors.response.use(response => {
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
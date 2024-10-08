import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.BASE_URL || 'http://192.168.0.248:8000/api/',
    // headers: {
    //     'Content-Type': 'application/json'
    //   },
});


export default axiosInstance;

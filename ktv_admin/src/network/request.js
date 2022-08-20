import axios from 'axios'

export function request(config){
  const instance = new axios.create({
    baseURL:"http://127.0.0.1:3000/api/",
    timeout: 6000
  });
  instance.interceptors.request.use(config =>{
    let token = window.localStorage.getItem('adminToken');
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },err =>{
    console.log("网络请求错误",err);
  });
  instance.interceptors.response.use(res =>{
    return res;
  },err =>{
    console.log("响应错误",eer);
  });
  return instance(config);
}

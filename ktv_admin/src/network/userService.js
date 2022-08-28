import {request} from './request'

export const createAccount = (route,data) => {
  return request({
    url: route,
    method: 'post',
    data:{
      ...data
    }
  });
}
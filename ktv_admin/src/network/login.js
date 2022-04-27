import {request} from './request'

export const getLogin = (route,data) => {
  return request({
    url: route,
    method: 'post',
    data:{
      ...data
    }
  });
}
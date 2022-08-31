import {request} from './request'

export const getAllOrder = (route) => {
  return request({
    url: route,
    method: 'get',
  });
}
export const deleteOrderById = (route,data) => {
  return request({
    url: route,
    method: 'post',
    data:{
      ...data,
    }
  });
}
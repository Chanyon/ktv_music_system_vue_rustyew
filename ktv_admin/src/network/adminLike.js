import {request} from './request'

export const getAdminLikeSong = (route) => {
    return request({
      url: route,
      method: 'get'
    })
}

export const searchLikeSong = (route,data) => {
  return request({
    url: route,
    method: 'post',
    data:{
      ...data,
    }
  })
}

export const deleteLikeSong = (route,data) => {
  return request({
    url: route,
    method: 'post',
    data: {
      ...data,
    }
  })
}
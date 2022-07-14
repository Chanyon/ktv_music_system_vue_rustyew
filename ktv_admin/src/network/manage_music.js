import {request} from './request'

export const getAllSongRoute = (route) => {
    return request({
      url: route,
      method: 'get'
    })
}

export const searchMusicByName = (route, name) => {
  return request({
    url: route,
    method: 'post',
    data:{
      ...name
    }
  })
}

export const linkMusic = (id) => {
  return request({
    url: 'admin/adminlike/add',
    method: 'post',
    data:{
      ...id
    }
  })
}
export const editMusic = (editForm) => {
  return request({
    url: 'admin/music/edit',
    method: 'post',
    data:{
      ...editForm
    }
  })
}

export const delMusic = (id) => {
  return request({
    url: 'admin/music/delete',
    method: 'post',
    data:{
      id
    }
  })
}

export const addMusic = (formData) => {
  return request({
    url: 'admin/music/add',
    method: 'post',
    data:{
      ...formData
    }
  })
}
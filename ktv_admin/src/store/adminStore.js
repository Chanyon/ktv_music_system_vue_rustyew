const state =()=>({
    isAdminAuthorization: false,
    adminInfo: {}
});
const getters = {
  isAdminAuthorization: state => {
    
    return state.isAdminAuthorization;
  },
  adminInfo: state => state.adminInfo,
};
const mutations = {
  isAdminAuthorization:(state, authorization) =>{
    state.isAdminAuthorization = authorization;
  },
  setAdminInfo:(state, info) =>{
    state.adminInfo = info;
  },
};
const actions = {
  isAdminAuthorization:({commit}, authorization) =>{
    
    commit("isAdminAuthorization", authorization);
  },
  setAdminInfo:({commit}, info) =>{
    
    commit("setAdminInfo", info);
  },
  clearAdminAuthorization:({commit}) =>{
    window.localStorage.removeItem("adminToken");
    commit("isAdminAuthorization", false)
  }
}
const adminStore = {
  state: state(),
  getters,
  mutations,
  actions,
}
export default adminStore;
import {Loading} from 'element-ui'
import Vue from 'vue'

let loadingInstance;
let wsmLoading = {
  start(notice,bgcolor,fullscreen) {
    loadingInstance = Loading.service({
      fullscreen: fullscreen ? fullscreen : true,
      text:notice ? notice : '正在加载中...',
      background:bgcolor ? bgcolor : 'rgba(0,0,0,0.7)',
      lock: true
    });
  },
  end(){
    Vue.nextTick(()=>{
      loadingInstance.close();
    })
  }
}
export default wsmLoading;
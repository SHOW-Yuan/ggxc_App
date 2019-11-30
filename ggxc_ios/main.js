import Vue from 'vue'
import App from './App'

// 请求地址
import baseURL from './pages/plugins/IPconfig';
Vue.use(baseURL);

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

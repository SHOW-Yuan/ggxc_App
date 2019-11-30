
const  baseURL = (Vue) => {
  Vue.prototype.$ip = new Vue({
    data () {
      return {
        url: {
          //基本接口
          // ip1: 'yue8',
           ip1: 'http://api.school.jiongtukeji.com',
          // ip1:'http://192.168.18.160:8080',
          //别人的接口
          // ip2: 'menmian-area',
          //ip2: 'http://47.98.46.26:8082',
           ip2:'http://api.school.jiongtukeji.com',
          // ip2:'http://192.168.18.160:8080'
        }
      };
    },
  });
};

export default baseURL;

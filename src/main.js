import Vue from 'vue';
import App from './App';
import store from "./plugin/loading";
import router from './router/index';
import i18n from './i18n/index';
import "./plugin/fastClick";
import "./plugin/confirm";
import './components/index';

import VueResource from 'vue-resource';
Vue.use(VueResource);
Vue.http.options.root = 'http://118.190.96.118:8080/exercitation-app'; 
Vue.http.options.emulateHTTP = true;
Vue.http.options.emulateJSON = false;
Vue.http.interceptors.push(function(request, next) {
  const timestamp = sessionStorage.getItem('auth.jwt_timestamp');
  const token = sessionStorage.getItem('auth.jwt_token');
  const Authentication = sessionStorage.getItem('auth.jwt_Authentication');

  if (Authentication) {
    const identityId = JSON.parse(sessionStorage.getItem('user')).identityId;
  request.headers.set('token', token); //setting request.headers
  request.headers.set('Authorization', Authentication); //setting request.headers
  request.headers.set('timestamp', timestamp); //setting request.headers
  request.headers.set('identityId', identityId); //setting request.headers

  } else {
    // delete Vue.http.headers.common.Authorization;
  }
  next(function(response) {
      // ...na
      // 请求发送后的处理逻辑
      // ...
      // 根据请求的状态，response参数会返回给successCallback或errorCallback
      return response
    })
  })

Vue.config.productionTip = false;

router.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', {isLoading: true})
  next()
})

router.afterEach(function (to) {
  store.commit('updateLoadingStatus', {isLoading: false})
})

new Vue({
  i18n,
  store,
  router,
  render: h => h(App),
}).$mount('#app-box');

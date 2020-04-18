import Vue from 'vue';
import VueRouter from "vue-router";
import Vuex from "vuex";

Vue.use(VueRouter);
Vue.use(Vuex);

import ElementUI from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);


Vue.config.productionTip = true


// 引入模块
import App from './App.vue';
import registerComponent from "./pages/register.vue";
import indexComponent from "./pages/index.vue";





import dialogComponent from "./components/dialog.vue";
import dislogMessageComponent from "./components/dialogMessage.vue";
import editGroup from "./components/editGroup.vue";

Vue.component("dialogGroup",dialogComponent);
Vue.component("dialogMessage",dislogMessageComponent);
Vue.component("editGroup",editGroup);


const router = new VueRouter({
  routes: [
    { path: "/", redirect: "register"},
    { path: "/register", component: registerComponent },
    { path: "/index", component: indexComponent },
  ]
})

const store = new Vuex.Store({
  state: {
    
  }
})


new Vue({
  router,
  store,
  render: h => h(App),

}).$mount('#app')

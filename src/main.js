import Vue from 'vue';
import VueRouter from "vue-router";

Vue.use(VueRouter);



Vue.config.productionTip = true


// 引入模块
import App from './App.vue';
import registerComponent from "./pages/register.vue";
import indexComponent from "./pages/index.vue";



import dialogComponent from "./components/dialog.vue";
import dislogMessageComponent from "./components/dialogMessage.vue";


Vue.component("dialogGroup",dialogComponent);
Vue.component("dialogMessage",dislogMessageComponent);


const router = new VueRouter({
  routes: [
    { path: "/", redirect: "register"},
    // { path: "/", redirect: "index" },
    { path: "/register", component: registerComponent },
    { path: "/index", component: indexComponent },
  ]
})


new Vue({
  router,
  render: h => h(App),

}).$mount('#app')
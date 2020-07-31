import Vue from "vue";
import VueRouter from "vue-router";


Vue.use(VueRouter);


import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);



Vue.config.productionTip = true;

// 引入模块
import App from "./App.vue";
import registerComponent from "./pages/register.vue";
import indexComponent from "./pages/index.vue";

import dialogComponent from "./components/dialog.vue";
import information from "./components/information.vue";
import editGroup from "./components/editGroup.vue";
import navigation from "./components/navigation.vue";

Vue.component("dialogGroup", dialogComponent);
Vue.component("information", information);
Vue.component("navigation", navigation);
Vue.component("editGroup", editGroup);

const router = new VueRouter({
  routes: [
    { path: "/", redirect: "register" },
    { path: "/register", component: registerComponent },
    { path: "/index", component: indexComponent },
  ],
});



new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

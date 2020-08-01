import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);
axios.defaults.baseURL = "http://localhost:3000/";

Vue.config.productionTip = true;

// 引入模块
import App from "./App.vue";
import registerComponent from "./pages/register.vue";
import indexComponent from "./pages/index.vue";

import dialogGroup from "./components/dialog/dialogGroup.vue";
import information from "./components/dialog/information.vue";
import editGroup from "./components/editGroup.vue";
import navigation from "./components/navigation.vue";
import search from "./components/search.vue";

import dialogComponent from "./components/dialog/dialogComponent.vue";
import userComponent from "./components/user/userComponent.vue";
import collectComponent from "./components/collect/collectComponent.vue";
import fileComponent from "./components/file/fileComponent.vue";

Vue.component("dialogGroup", dialogGroup);
Vue.component("information", information);
Vue.component("navigation", navigation);
Vue.component("editGroup", editGroup);
Vue.component("search", search);

const router = new VueRouter({
    routes: [
        { path: "/", redirect: "register" },
        { path: "/register", component: registerComponent },
        {
            path: "/index",
            component: indexComponent,
            children: [
                { path: "dialog", component: dialogComponent },
                { path: "user", component: userComponent },
                { path: "collect", component: collectComponent },
                { path: "file", component: fileComponent },
            ],
        },
    ],
});

new Vue({
    router,
    data: {
        userList: []
    },
    render: (h) => h(App),
}).$mount("#app");

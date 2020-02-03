import Vue from "vue";
import VueRouter from "vue-router";
import LoaderHome from "../views/LoaderHome.vue";
import Home from "../views/Home.vue";
import Custom from "../views/Custom.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/loader",
    name: "loader",
    component: LoaderHome
  },
  {
    path: "/custom",
    name: "custom",
    component: Custom
  }
];

const router = new VueRouter({
  routes
});

export default router;

import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView";
import SigninView from "../views/auth/SigninView";
import SignupView from "../views/auth/SignupView";
import ProfileView from "../views/user/ProfileView";
import store from "../store/index";

Vue.use(VueRouter);

const isLoggedIn = (to, from, next) => {
  if (store.getters["user/isLoggedIn"]) {
    next();
  } else if (store.getters["user/isLoggedIn"] === null) {
    const unsubscribe = store.subscribe((mutation) => {
      if (mutation.type === "user/refreshTokenSuccess") {
        next();
        unsubscribe();
      } else if (mutation.type === "user/refreshTokenError") {
        router.push("/signin");
        unsubscribe();
      }
    });
  } else {
    router.push("/signin");
  }
};

const routes = [
  {
    path: "/",
    component: HomeView,
  },
  {
    path: "/Signin",
    component: SigninView,
  },
  {
    path: "/SignUp",
    component: SignupView,
  },
  {
    path: "/Profile",
    beforeEnter: isLoggedIn,
    component: ProfileView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

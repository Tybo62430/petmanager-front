import router from "@/router";
import axios from "../http";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const user = {
  namespaced: true,
  state: {
    data: {},
    isLoading: false,
    isLoggedIn: localStorage.getItem("jwtToken") ? null : false,
    jwtToken: localStorage.getItem("jwtToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    errors: [],
  },
  getters: {
    isLoading: (state) => state.isLoading,
    isLoggedIn: (state) => state.isLoggedIn,
    errors: (state) => state.errors,
    currentUser: (state) => state.data,
    jwtToken: (state) => state.jwtToken,
  },
  mutations: {
    updateIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    signinSuccess(state, data) {
      state.isLoading = false;
      state.errors = [];
      state.isLoggedIn = true;
      state.data = null;
      state.jwtToken = data.token;
      state.refreshToken = data.refresh_token;
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("refreshToken", data.refresh_token);
    },
    signupSuccess(state) {
      state.isLoading = false;
      state.errors = [];
    },
    signOut(state) {
      state.jwtToken = null;
      state.refreshToken = null;
      state.data = null;
      state.isLoggedIn = false;
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("refreshToken");
    },
    signError(state, errors) {
      state.isLoading = false;
      state.errors = [errors.response.data.message];
    },
    fetchCurrentUserSuccess(state, user) {
      state.data = user;
      state.isLoading = false;
      state.isLoggedIn = true;
      state.errors = [];
    },
    refreshTokenSuccess(state, data) {
      state.isLoggedIn = true;
      state.jwtToken = data.token;
      state.refreshToken = data.refresh_token;
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("refreshToken", data.refresh_token);
    },
    refreshTokenError(state) {
      state.data = null;
      state.isLoggedIn = false;
      state.jwtToken = null;
      state.refreshToken = null;
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("refreshToken");
    },
  },
  actions: {
    async trySignin(context, credentials) {
      try {
        context.commit("updateIsLoading", true);
        const response = await axios.post("/api/login", credentials);
        context.commit("signinSuccess", response.data);
        context.dispatch("fetchCurrentUser");
        router.push("/profile");
      } catch (error) {
        context.commit("signError", error);
      }
    },
    async trySignup(context, user) {
      try {
        context.commit("updateIsLoading", true);
        await axios.post("/api/users", user);
        context.commit("signupSuccess");
        router.push("/signin");
      } catch (error) {
        context.commit("signError", error);
      }
    },
    async fetchCurrentUser(context) {
      try {
        context.commit("updateIsLoading", true);
        const response = await axios.get("/api/me");
        context.commit("fetchCurrentUserSuccess", response.data);
      } catch (error) {
        context.commit("signError", error);
      }
    },
    async refreshToken(context) {
      try {
        const response = await axios.get("/api/token/refresh", {
          params: { refresh_token: context.state.refreshToken },
        });
        setTimeout(() => {
          context.dispatch("refreshToken");
        }, 14 * 60 * 1000);
        context.dispatch("fetchCurrentUser");
        context.commit("refreshTokenSuccess", response.data);
      } catch (error) {
        // router.push("/signin");
        context.commit("refreshTokenError");
      }
    },
  },
};

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: { user },
});

<template>
  <div class="card p-4 d-flex flex-column">
    <div v-if="user">email: {{ user.email }}</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ProfileVue",
  computed: {
    ...mapGetters("user", { user: "currentUser" }),
  },
};
</script>

<style scoped></style>

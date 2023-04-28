<template>
  <v-app id="inspire" class="main-container">
    <Navbar v-if="isLoggedIn"/>
    <v-main class="primary-bg" :class="isLoggedIn ? 'pt-16' : ''">
      <v-container :class="{'pa-0' : !isLoggedIn}">
        <router-view/>
      </v-container>
      </v-main>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  name: 'App',
  components:{
    Navbar,
  },
  computed:{
		isLoggedIn(){
      const currentUser = sessionStorage.getItem("currentLangLiftUser");
			if (!currentUser && this.$route.path !== '/login') {
			this.$router.replace("/login")
			} else if (currentUser && this.$route.path === '/login') {
			this.$router.replace("/")
			}
			return currentUser;
		}
}
};
</script>

<style scoped>
.main-container {
  font-family: 'Roboto', sans-serif !important;
}
</style>
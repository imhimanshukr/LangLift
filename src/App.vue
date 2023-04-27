<template>
  <v-app id="inspire">
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
			if (!currentUser && this.$route.path !== '/') {
			this.$router.replace("/")
			} else if (currentUser && this.$route.path === '/') {
			this.$router.replace("/home")
			}
			return currentUser;
		}
}
};
</script>

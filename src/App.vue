<template>
  <v-app id="inspire">
    <Sidebar/>
    <Navbar/>
    <v-main class="primary-bg">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";

export default {
  name: 'App',
  components:{
    Navbar,
    Sidebar
  }
};
</script>

<template>
    <v-navigation-drawer
      v-model="drawer"
      app
      :mini-variant.sync="$store.state.drawer"
      permanent
      mini-variant-width="80"
      class="primary-bg"
    >
    <v-list-item class="px-4 py-4">
        <v-list-item-avatar size="40">
          <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-title class="white--text">Definitionary</v-list-item-title>

      </v-list-item>
      <v-icon class="white--text absolute drawer-icon" @click="$store.state.drawer = !$store.state.drawer">mdi-chevron-right</v-icon>


      <v-divider></v-divider>

      <v-list dense class="pt-2">
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.to"
          active-class="active-link"
          class="nav-link"
        >
          <v-list-item-icon class="mr-0">
            <v-icon color="#ffffffa8">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content class="ml-4">
            <v-list-item-title class="primary-text">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>
<script>
export default {
    name: "SideBar",
    data(){
        return {
            drawer: true,
            items: [
          { title: 'Home', icon: 'mdi-home-outline', to:"/" },
          { title: 'History', icon: 'mdi-history', to:"history" },
          { title: 'Bookmarks', icon: 'mdi-bookmark-check-outline', to:"bookmarks" },
        ],
        }
    }
}
</script>
<style scoped>
    .theme--light.v-navigation-drawer .v-divider {
    border-color: rgba(255, 255, 255, 0.2);
}
.theme--light.v-navigation-drawer:not(.v-navigation-drawer--floating) .v-navigation-drawer__border {
    background-color: transparent;
}
.v-sheet.v-list {
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    height: calc(100vh - 89px);
}
.nav-link {
    padding: 5px 15px;
    margin: 10px;
}
.active-link, .nav-link:hover {
    background: #346AFF;
    border-radius: 30px;
}
.active-link .v-icon, .active-link .primary-text, .nav-link:hover .v-icon, .nav-link:hover .primary-text {
    color: white !important;
}
.theme--dark.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state):not(.v-input--is-disabled) > .v-input__control > .v-input__slot:hover fieldset {
    color: rgba(255, 255, 255, 0.2);
}
.drawer-icon{
    position: absolute;
    top: 45%;
    right: -5px;
    width: 50px;
    height: 80px;
    background: seagreen;
    border-radius: 0px 40px 40px 0px;
}
</style>

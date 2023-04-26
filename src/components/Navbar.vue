
<template>
  <v-container>
    <v-app-bar app class="navbar primary-bg" height="89px">
      <v-row>
      <v-col
          cols="10"
          sm="6"
        >
          <v-text-field
            filled
            rounded
            dark
            clearable
            dense
            append-icon="mdi-magnify"
            placeholder="Search history, bookmarks"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-menu
      left
        bottom
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            color="white"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>

        <v-list dense color="#1B1B1F" class="rounded-xl" elevation="24">
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
    </v-menu>
    
    
  </v-app-bar>
</v-container>
</template>
<script>
export default {
    name: "NavBar",
  data: () => ({
    items: [
          { title: 'Home', icon: 'mdi-home-outline', to:"/" },
          { title: 'History', icon: 'mdi-history', to:"history" },
          { title: 'Bookmarks', icon: 'mdi-bookmark-check-outline', to:"bookmarks" },
        ],
  }),
}
</script>
<style scoped>
    .navbar {
        border-color:  rgba(255, 255, 255, 0.2) !important;
        border-bottom: 1px solid  rgba(255, 255, 255, 0.2);
        box-shadow: none !important;
    }
    ::v-deep .v-text-field.v-text-field--enclosed .v-text-field__details {
        display: none !important;
    }
    .nav-link {
    padding: 0px 10px;
    margin: 10px;
}
.active-link, .nav-link:hover {
    background: #346AFF;
    border-radius: 30px;
}
.active-link .v-icon, .active-link .primary-text, .nav-link:hover .v-icon, .nav-link:hover .primary-text {
    color: white !important;
}
.theme--light.v-list-item--active:hover::before, .theme--light.v-list-item--active::before {
    opacity: 0;
}

</style>
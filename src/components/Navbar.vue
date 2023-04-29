
<template>
  <v-app-bar app class="navbar primary-bg" height="89px">
      <v-container class="d-flex align-center">
      <v-row class="d-flex align-center">
      <v-col cols="2" sm="1">
        <v-avatar
      color="#1B1B1F"
      size="45"
    >
      <span class="white--text text-h5" style="font-size: 18px !important;">{{ getAvatarText }}</span>
    </v-avatar>
      </v-col>
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
          :class="item.title === 'Delete account' ? 'del-link' : 'nav-link'"
          @click="navigate(item.title)"
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
  </v-container>
  <v-dialog v-model="showDialog" dark max-width="290">
			<v-card color="#323232" elevation="24">
				<v-card-title class="text-h6">
					Are you sure you want to delete account?
				</v-card-title>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="showDialog = false;">
						Cancel
					</v-btn>
					<v-btn color="red darken-1" text @click="onDeleteAccound()">
						Delete
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
  </v-app-bar>
</template>
<script>
export default {
    name: "NavBar",
  data: () => ({
    items: [
          { title: 'Home', icon: 'mdi-home-outline', to:"/" },
          { title: 'History', icon: 'mdi-history', to:"history" },
          { title: 'Bookmarks', icon: 'mdi-bookmark-check-outline', to:"bookmarks" },
          { title: 'Logout', icon: 'mdi-logout', to:"/login" },
          { title: 'Delete account', icon: 'mdi-delete', to:"/login" },
        ],
        showDialog: false,
  }),
  mounted(){
    this.updateLocalStorage();
  },
  methods:{
    navigate(text){
  if(text === "Logout"){
    const userData = JSON.parse(localStorage.getItem(`${this.$store.state.userName.replace(/\s+/g, '')}-LangLiftLoggedIn`));
    userData.loggedIn = false;
    localStorage.setItem(`${this.$store.state.userName.replace(/\s+/g, '')}-LangLiftLoggedIn`, JSON.stringify(userData));
    sessionStorage.removeItem("currentLangLiftUser");
    this.$router.replace("/login");
  }
  if(text === "Delete account"){
    this.showDialog = true;
  }
},
onDeleteAccound(){
  localStorage.removeItem(`${this.$store.state.userName.replace(/\s+/g, '')}-LangLiftLoggedIn`);
    sessionStorage.removeItem("currentLangLiftUser");
    this.$router.replace("/login");
},
    updateLocalStorage(){
            this.$store.state.userName = sessionStorage.getItem("currentLangLiftUser");
        }
},
computed:{
  getAvatarText() {
            let names = this.$store.state.userName.split(" ");
            let text = "";
            if (names.length === 1) {
              text = names[0].slice(0, 1);
            } else {
              text = names[0][0] + names[1][0];
            }
            return text.toUpperCase();
        }
}
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
.del-link:hover {
  background: red;
  border-radius: 30px;
}
.active-link .v-icon, .active-link .primary-text, .nav-link:hover .v-icon, .nav-link:hover .primary-text, .del-link:hover .v-icon, .del-link:hover .primary-text {
    color: white !important;
}
.theme--light.v-list-item--active:hover::before, .theme--light.v-list-item--active::before {
    opacity: 0;
}
.theme--light.v-btn:focus::before {
    opacity: 0;
}
</style>
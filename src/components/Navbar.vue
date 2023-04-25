
<template>
    <v-app-bar app class="navbar primary-bg" height="89px">
      <v-container>
      <v-row>
      <v-col
          cols="12"
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
    </v-container>


    </v-app-bar>
</template>
<script>
export default {
    name: "NavBar",
  data: () => ({
    
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

</style>
<template>
  <v-container class="mt-3" v-if="filteredBookmarks && filteredBookmarks.length > 0">
    <div class="d-flex justify-space-between align-center pr-2 mb-3">
      <v-select v-model="languageFilter" item-value="All" :hide-details="true" :items="languageOptions"
        placeholder="Filter by Language" dark filled dense class=""></v-select>
      <v-btn dark class="ml-10 text-capitalize" color="#616161" @click="clearAll()">Clear all</v-btn>
    </div>
    <audio ref="audioElement" src="../assets/delete.mp3"></audio>
    <v-row class="bookmarks">
      <v-col cols="12" md="6" class="py-0" v-for="bookmark in filteredBookmarks" :key="bookmark.id">
        <v-card color="#1B1B1F" class="my-3" style="height: 314px">
          <div class="d-flex justify-space-between align-center pr-2">
            <v-card-title class="text-capitalize" style="color: #ffffffb3">{{ bookmark.sourceText }} - {{
              bookmark.targetText }}
              <i class="fs-12 primary-text ml-2">
                ({{
                  bookmark.sourceLang.name + " - " + bookmark.targetLang.name
                }})</i></v-card-title>
            <v-icon style="color: #ffffffb3" class="pointer" @click="deleteBookmark(bookmark.id)">mdi-delete</v-icon>
          </div>
          <div class="d-flex justify-space-between align-center px-2">
            <v-tabs v-model="currentItem[bookmark.id]" dark center-active background-color="#1B1B1F"
              class="meaning-result">
              <v-tab v-for="item in bookmark.meaning" :key="item.partOfSpeech" :href="'#tab-' + item.partOfSpeech"
                class="pa-2 rounded-xl" active-class="active-result-tab">
                {{ item.partOfSpeech }}
              </v-tab>
            </v-tabs>
            <v-icon class="pa-3 fs-16 ml-2 rounded-xl pointer white--text" :class="bookmark.audio === audio
              ? 'skyblue-bg'
              : 'primary-bg'
              " @click="
    playDefinition(bookmark.audio);
  " v-if="bookmark.audio">mdi-volume-high</v-icon>
          </div>
          <v-tabs-items dark v-model="currentItem[bookmark.id]" class="mt-3">
            <v-tab-item v-for="item in bookmark.meaning" :key="item.partOfSpeech" :value="'tab-' + item.partOfSpeech">
              <v-card-text class="pt-2" style="color: #ffffffb3">
                <div v-if="item.synonyms.length > 0">
                  <strong>Synonyms: </strong> {{ item.synonyms.join(", ") }}
                </div>
                <div v-if="item.antonyms.length > 0">
                  <strong>Antonyms: </strong> {{ item.antonyms.join(", ") }}
                </div>
                <div class="d-flex mt-3" v-if="item.definitions.length > 0">
                  <h3 class="fs-14 mr-2">Definitions:</h3>
                  <ul class="defintion-box">
                    <li v-for="(definition, index) in item.definitions" :key="index" class="mb-2 definition-item">
                      <p class="pa-0 ma-0" v-if="definition.definition">
                        {{ definition.definition }}
                      </p>
                      <i class="pa-0" v-if="definition.example">eg: {{ definition.example }}</i>
                    </li>
                  </ul>
                </div>
              </v-card-text>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="showDeleteDialog" dark max-width="290">
      <v-card color="#323232" elevation="24">
        <v-card-title class="text-h6">
          Are you sure you want to delete?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelDelete()">
            Cancel
          </v-btn>
          <v-btn color="red darken-1" text @click="onFinalDelete()">
            Delete
          </v-btn>
          <audio ref="audioElement" src="../assets/delete.mp3"></audio>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  <v-container v-else class="no-data">
    <h1 class="text-h6 mb-2">No bookmark available</h1>
    <v-btn to="/" link dark>Home</v-btn>
  </v-container>
</template>

<script>
export default {
  name: "BookMarks",
  data() {
    return {
      bookmarks: [],
      currentItem: {},
      languageFilter: "All",
      languageOptions: ["All"],
      audio: null,
      audioPlayer: null,
      showDeleteDialog: false,
      deleteOption: null,
      userData: null,
    };
  },
  mounted() {
    const userName = sessionStorage.getItem("currentLangLiftUser");
    this.userData = JSON.parse(
      localStorage.getItem(`${userName.replace(/\s+/g, "")}-LangLiftLoggedIn`)
    );
    this.$store.state.bookmarks = this.userData.bookmarks;
    const lang = new Set(
      this.$store.state.bookmarks.map(
        (item) => `${item.sourceLang.name} - ${item.targetLang.name}`
      )
    );
    this.languageOptions.push(...lang);
  },
  computed: {
    filteredBookmarks() {
      if (this.languageFilter !== "All" && this.languageFilter) {
        return this.$store.state.bookmarks.filter(
          (item) =>
            item.sourceLang.name == this.languageFilter.split(" ")[0] &&
            item.targetLang.name == this.languageFilter.split(" ")[2]
        );
      } else {
        return this.$store.state.bookmarks;
      }
    },
  },
  methods: {
    playDefinition(audio) {
      this.audio = audio;
      this.audioPlayer = new Audio(audio);
      this.audioPlayer.play();
      this.audioPlayer.addEventListener('ended', () => {
        this.audio = null;
      });
    },
    clearAll() {
      this.deleteOption = 1
      this.showDeleteDialog = true;
    },
    deleteBookmark(id) {
      this.deleteOption = 2;
      this.idToDelete = id;
      this.showDeleteDialog = true;
    },
    onFinalDelete() {
      const currentUser = sessionStorage.getItem("currentLangLiftUser");
      if (this.deleteOption === 1) {
        this.userData.bookmarks = [];
        this.$store.state.bookmarks = this.userData.bookmarks;
        this.$refs.audioElement.play();
        this.$toast.success("Deleted Successfully!", { timeout: 2000 });
        this.showDeleteDialog = false;
      }
      if (this.deleteOption === 2) {
        this.userData.bookmarks = this.userData.bookmarks.filter((item) => item.id != this.idToDelete);
        this.$refs.audioElement.play();
        this.$toast.success("Deleted Successfully!", { timeout: 2000 });
        this.showDeleteDialog = false;
      }
      localStorage.setItem(`${currentUser.replace(/\s+/g, '')}-LangLiftLoggedIn`, JSON.stringify(this.userData));
      this.$store.state.bookmarks = this.userData.bookmarks;
    },
    cancelDelete() {
      this.deleteOption = null;
      this.idToDelete = null;
      this.showDeleteDialog = null;
    }
  },
};
</script>

<style scoped>
.defintion-box {
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  max-height: 110px;
  scrollbar-color: #ccc #f2f2f2;
}

.defintion-box::-webkit-scrollbar {
  width: 3px;
}

.defintion-box::-webkit-scrollbar-track {
  background: #9399a2;
  border-radius: 3px;
}

.defintion-box::-webkit-scrollbar-thumb {
  background-color: #f2f2f2;
  border-radius: 3px;
}

::v-deep .theme--dark.v-tabs-items {
  background-color: #1b1b1f;
}

::v-deep .theme--dark.v-tabs .v-tab:hover::before {
  opacity: 0;
}

::v-deep .theme--dark.v-text-field>.v-input__control>.v-input__slot:before,
::v-deep .theme--dark.v-text-field:not(.v-input--has-state):hover>.v-input__control>.v-input__slot:before,
::v-deep .v-text-field>.v-input__control>.v-input__slot:after {
  border-color: #111116 !important;
}

::v-deep .v-text-field--filled {
  border-radius: 4px;
}

::v-deep .v-tabs {
  max-width: calc(100% - 50px);
}

::v-deep .v-slide-group:not(.v-slide-group--has-affixes)>.v-slide-group__prev,
.v-slide-group:not(.v-slide-group--has-affixes)>.v-slide-prev {
  display: none !important;
}

.bookmarks {
  max-height: calc(100vh - 170px);
  overflow-x: hidden;
  overflow-y: auto;
}

.bookmarks::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.bookmarks::-webkit-scrollbar-track {
  background: #2D2D2D;
  border-radius: 4px;
}

.bookmarks::-webkit-scrollbar-thumb {
  background-color: #4E4E4E;
  border-radius: 4px;
}

.bookmarks::-webkit-scrollbar-thumb:hover {
  background-color: #7F7F7F;
}

.no-data {
  height: calc(100vh - 90px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.no-data h1 {
  color: #9b9b9b;
  font-weight: 400;
  text-align: center;
}
</style>

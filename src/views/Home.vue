<template>
  <v-container fluid>
    <div class="mt-4 d-flex align-center" v-if="favorite.length > 0">
      <h3 class="fs-14 mr-3 text-no-wrap white--text">Your Favorites</h3>
      <v-tabs background-color="transparent" center-active class="favorites">
        <v-tab
          class="favorite-tab mr-3"
          :class="item.active ? 'active-tab' : ''"
          v-for="(item, index) in favorite"
          :key="index"
          @click="selectFavorite(item)"
          >{{ item.from.name }} - {{ item.to.name }}</v-tab
        >
      </v-tabs>
    </div>
    <v-row class="mt-1 relative">
      <v-col cols="12" md="6">
        <div class="pa-5 secondary-bg rounded-xl">
          <div class="d-flex align-center">
            <h4 class="fs-14 primary-text mr-3">From</h4>
            <v-autocomplete
              :items="$store.state.languageList"
              v-model="sourceLang"
              filled
              rounded
              hide-details
              dark
              item-text="name"
              item-value="sign"
              prepend-inner-icon="mdi-web"
              class="lang"
              @change="getSourceLang"
            ></v-autocomplete>
          </div>
          <v-textarea
            rows="4"
            filled
            hide-details
            color="#1B1B1F"
            dark
            rounded
            auto-grow
            class="no-focus-outline mt-4"
            v-model="sourceText"
            placeholder="Enter Text"
          ></v-textarea>
          <div class="d-flex justify-end mt-4">
            <v-icon
              class="pa-3 fs-16 rounded-xl pointer"
              :class="favoriteActive ? 'skyblue-bg' : 'primary-bg'"
              @click="addFavorite"
              >{{
                favoriteActive ? "mdi-cards-heart" : "mdi-heart-outline"
              }}</v-icon
            >
            <v-icon
              class="pa-3 fs-16 ml-2 rounded-xl pointer"
              :class="activeMic ? 'skyblue-bg' : 'primary-bg'"
              @click="record()"
              >mdi-microphone</v-icon
            >
          </div>
        </div>
      </v-col>
      <v-icon
        class="pa-3 fs-16 rounded-xl pointer skyblue-bg absolute"
        style="
          left: 50%;
          top: 50%;
          transform: translate(-50%, -40%);
          border: 5px solid #111116;
        "
        @click="swapLanguage"
        >mdi-swap-horizontal</v-icon
      >
      <v-col cols="12" md="6">
        <div class="pa-5 secondary-bg rounded-xl">
          <div class="d-flex align-center">
            <h4 class="fs-14 primary-text mr-3">Into</h4>
            <v-autocomplete
              :items="$store.state.languageList"
              v-model="targetLang"
              filled
              rounded
              hide-details
              dark
              item-text="name"
              item-value="sign"
              prepend-inner-icon="mdi-web"
              class="lang"
              @change="getTargetLang"
            ></v-autocomplete>
          </div>
          <v-textarea
            rows="4"
            filled
            hide-details
            color="#1B1B1F"
            :readonly="true"
            dark
            rounded
            auto-grow
            class="no-focus-outline mt-4"
            v-model="$store.state.result"
            placeholder="Translation"
          ></v-textarea>
          <div class="d-flex justify-end align-center mt-4">
            <div class="d-flex">
              <div @click="playMeaning()">
                <v-icon
                  class="pa-3 fs-16 rounded-xl pointer"
                  :class="activeSpeaker ? 'skyblue-bg' : 'primary-bg'"
                  >mdi-volume-high</v-icon
                >
                <speech :text="$store.state.result" ref="speech"></speech>
              </div>
              <v-icon
                class="pa-3 fs-16 rounded-xl ml-2 pointer"
                @click="copyText"
                :class="isCopied ? 'skyblue-bg' : 'primary-bg'"
                >{{ isCopied ? "mdi-check" : "mdi-content-copy" }}</v-icon
              >
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-card
      class="pa-4 my-4 rounded-xl"
      color="#1B1B1F"
      v-if="
        $store.state.meaning.length > 0 && $store.state.result && sourceText
      "
    >
      <div class="d-flex justify-space-between align-center">
        <v-tabs
          v-model="currentItem"
          dark
          center-active
          background-color="transparent"
          class="meaning-result"
        >
          <v-tab
            v-for="item in $store.state.meaning"
            :key="item.partOfSpeech"
            :href="'#tab-' + item.partOfSpeech"
            class="pa-2 rounded-xl"
            active-class="active-result-tab"
          >
            {{ item.partOfSpeech }}
          </v-tab>
        </v-tabs>
        <v-icon
          class="pa-3 fs-16 ml-2 rounded-xl pointer"
          :class="isDefinitionPlay ? 'skyblue-bg' : 'primary-bg'"
          @click="playDefinition()"
          v-if="$store.state.wordAudio"
          >mdi-volume-high</v-icon
        >
        <v-icon
          class="pa-3 fs-16 ml-2 rounded-xl pointer"
          @click="setBookmark()" :class="isBookmarked ? 'skyblue-bg' : 'primary-bg'"
                >{{ isBookmarked ? "mdi-check" : 'mdi-bookmark-outline'}}</v-icon
        >
        <audio
          ref="audioElement"
          :src="$store.state.wordAudio"
          @ended="onAudioEnded"
        ></audio>
      </div>
      <v-tabs-items dark v-model="currentItem" class="mt-4">
        <v-tab-item
          v-for="item in $store.state.meaning"
          :key="item.partOfSpeech"
          :value="'tab-' + item.partOfSpeech"
        >
          <v-card color="#111116" dark>
            <v-card-text>
              <i class="fs-14">{{ item.definitions[0].definition }}</i>
              <div v-if="item.antonyms.length > 0" class="mt-4">
                <p class="d-flex">
                  <span>Antonyms: </span>
                  <span class="d-flex flex-wrap">
                    <i> {{ item.antonyms.join(", ") }}</i>
                    </span
                  >
                </p>
              </div>
              <div v-if="item.synonyms.length > 0">
                <p class="d-flex">
                  <span>Synonyms: </span>
                  <span class="d-flex flex-wrap"
                    > <i> {{ item.synonyms.join(", ") }}</i>
                    </span
                  >
                </p>
              </div>
              <div class="d-flex mt-3">
                <h3 class="fs-14 mr-2">Definitions:</h3>
                <ul class="defintion-box">
                  <li
                    v-for="(definition, index) in item.definitions"
                    :key="index"
                    class="mb-2 definition-item"
                  >
                    <p class="pa-0 ma-0" v-if="definition.definition">
                      {{ definition.definition }}
                    </p>
                    <i class="pa-0" v-if="definition.example"
                      >eg: {{ definition.example }}</i
                    >
                  </li>
                </ul>
              </div>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";
import Speech from "vue-speech";
import { debounce } from "lodash";

// import { slugify } from 'transliteration'

export default {
  name: "HomePage",
  data() {
    return {
      favorite: [],
      sourceLang: {},
      targetLang: {},
      sourceText: "",
      activeMic: false,
      activeSpeaker: false,
      favoriteActive: false,
      isCopied: false,
      recognition: null,
      message: "",
      currentItem: "tab-Web",
      showMore: false,
      isDefinitionPlay: false,
      isBookmarked: false,
    };
  },
  mounted() {
    this.getLanguageList();
    this.getWordOfTheDay();
    this.$store.state.userName = sessionStorage.getItem("currentLangLiftUser");
    const translationParams = this.$route.params.translation;
    const userData = JSON.parse(
      localStorage.getItem(
        `${this.$store.state.userName.replace(/\s+/g, "")}-LangLiftLoggedIn`
      )
    );
    if (userData) {
      this.favorite = userData.favorite;
    }
    if (translationParams) {
      this.sourceLang = {
        name: translationParams.sourceLang.name,
        sign: translationParams.sourceLang.sign,
      };
      this.targetLang = {
        name: translationParams.targetLang.name,
        sign: translationParams.targetLang.sign,
      };
      this.sourceText = translationParams.sourceText;
      this.checkFavorite();
    } else if (this.favorite.length > 0) {
      this.sourceLang = {
        name: this.favorite[0].from.name,
        sign: this.favorite[0].from.sign,
      };
      this.targetLang = {
        name: this.favorite[0].to.name,
        sign: this.favorite[0].to.sign,
      };
      this.checkFavorite();
    } else {
      this.sourceLang = {
        name: "English",
        sign: "en",
      };
      this.targetLang = {
        name: "Hindi",
        sign: "hi",
      };
    }
  },
  methods: {
    ...mapActions([
      "getLanguageList",
      "translateWord",
      "getWordMeaning",
      "getWordOfTheDay",
      "setBookmarkData",
    ]),
    swapLanguage() {
      const targetLang = this.targetLang;
      this.targetLang = this.sourceLang;
      this.sourceLang = targetLang;
      const targetText = this.$store.state.result;
      this.$store.state.result = "";
      this.sourceText = targetText;
      this.checkFavorite();
    },
    addFavorite() {
      const index = this.favorite.findIndex((item) => {
        return (
          item.from.name === this.sourceLang.name &&
          item.to.name === this.targetLang.name
        );
      });
      if (index === -1) {
        const favorite = [...this.favorite];
        favorite.unshift({
          from: {
            name: this.sourceLang.name,
            sign: this.sourceLang.sign,
          },
          active: false,
          to: {
            name: this.targetLang.name,
            sign: this.targetLang.sign,
          },
        });
        this.favorite = favorite;
      } else {
        this.favorite.splice(index, 1);
        this.favoriteActive = false;
      }
      this.checkFavorite();
      this.updateLocalStorage();
    },
    selectFavorite(selectedCombo) {
      const { from, to } = selectedCombo;
      const sourceLang = this.getLanguageInfo(from.sign);
      const targetLang = this.getLanguageInfo(to.sign);
      this.sourceLang = sourceLang;
      this.targetLang = targetLang;
      this.reset();
    },
    getSourceLang(event) {
      const sourceLang = this.getLanguageInfo(event);
      this.sourceLang = sourceLang;
      this.sourceText = "";
      this.checkFavorite();
    },
    getTargetLang(event) {
      const targetLang = this.getLanguageInfo(event);
      this.targetLang = targetLang;
      this.checkFavorite();
    },
    getLanguageInfo(language) {
      return this.$store.state.languageList.find(
        (lang) => lang.sign === language || language?.from?.sign
      );
    },
    checkFavorite() {
      this.favoriteActive = false;
      this.favorite = this.favorite.map((item) => {
        return {
          ...item,
          active: false,
        };
      });
      const index = this.favorite.findIndex((item) => {
        return (
          item.from.name === this.sourceLang.name &&
          item.to.name === this.targetLang.name
        );
      });
      if (index !== -1) {
        this.favorite[index].active = true;
        this.favoriteActive = true;
      }
    },
    record() {
      this.activeMic = !this.activeMic;
      if (this.activeMic) {
        this.sourceText = "";
        // eslint-disable-next-line no-undef
        this.recognition = new webkitSpeechRecognition();
        this.recognition.lang = "en-US";
        this.recognition.interimResults = false;
        this.recognition.continuous = true;
        this.recognition.onresult = (event) => {
          const results = event.results[event.resultIndex];
          const transcript = results[0].transcript;
          this.sourceText += transcript;
        };
        this.recognition.start();
        this.recognition.onend = () => {
          this.activeMic = false;
        };
      } else {
        this.recognition.stop();
      }
    },
    playMeaning() {
      if (this.$store.state.result.length > 0) {
        this.activeSpeaker = true;
        const utterance = new SpeechSynthesisUtterance(
          this.$store.state.result
        );
        utterance.lang = "hi-IND";
        utterance.onend = () => {
          this.activeSpeaker = false;
        };
        speechSynthesis.speak(utterance);
      }
    },
    copyText() {
      if (this.$store.state.result.length > 0) {
        navigator.clipboard.writeText(this.$store.state.result);
        this.isCopied = true;
        setTimeout(() => {
          this.isCopied = false;
        }, 600);
      }
    },
    playDefinition() {
      this.isDefinitionPlay = true;
      this.$refs.audioElement.play();
    },
    onAudioEnded() {
      this.isDefinitionPlay = false;
    },
    setBookmark() {
      this.setBookmarkData({sourceLang: this.sourceLang, targetLang: this.targetLang, sourceText: this.sourceText, targetText: this.$store.state.result, meaning: this.$store.state.meaning})
      this.isBookmarked = true;
        setTimeout(() =>{
          this.isBookmarked = false;
        }, 600)
    },
    reset() {
      this.activeMic = false;
      this.activeSpeaker = false;
      this.sourceText = "";
      this.$store.state.meaning = [];
      this.checkFavorite();
    },
    updateLocalStorage() {
      const userData = JSON.parse(
        localStorage.getItem(
          `${this.$store.state.userName.replace(/\s+/g, "")}-LangLiftLoggedIn`
        )
      );
      userData.favorite = this.favorite;
      localStorage.setItem(
        `${this.$store.state.userName.replace(/\s+/g, "")}-LangLiftLoggedIn`,
        JSON.stringify(userData)
      );
    },
  },
  watch: {
    // eslint-disable-next-line no-undef
    sourceText: debounce(function (sourceText) {
      if (sourceText !== "" && this.targetLang) {
        this.$store.state.meaning = [];
        this.$store.state.wordAudio = null;
        this.translateWord({
          sourceLang: this.sourceLang,
          targetLang: this.targetLang,
          sourceText,
        });
      } else {
        this.$store.state.result = [];
      }
    }, 1000),
    targetLang(targetLang) {
      if (targetLang && this.sourceLang && this.sourceText) {
        this.translateWord({
          sourceLang: this.sourceLang,
          targetLang: targetLang,
          sourceText: this.sourceText,
        });
      } else {
        this.$store.state.result = [];
      }
    },
  },
  components: {
    Speech,
  },
};
</script>
<style scoped>
.favorite-tab {
  font-size: 12px;
  color: #fff !important;
  border: 1px solid #5f5f63;
  border-radius: 30px;
  text-transform: capitalize;
  height: 35px;
}

.active-tab {
  background: #346aff;
  border-color: #346aff;
}

::v-deep .v-tabs-slider {
  display: none !important;
}

::v-deep .v-tabs-bar {
  height: auto;
}

::v-deep .theme--light.v-icon {
  color: white !important;
}

::v-deep .v-text-field.v-text-field--enclosed .v-text-field__details {
  display: none;
}

::v-deep
  .theme--dark.v-text-field--filled
  > .v-input__control
  > .v-input__slot {
  background: #111116 !important;
}

::v-deep .v-select__selection--comma {
  margin: 11px 0px 6px 6px;
}

::v-deep .v-text-field input {
  padding: 14px 5px 8px;
}
::v-deep .theme--light.v-icon:focus::after {
  opacity: 0;
}
::v-deep .v-slide-group:not(.v-slide-group--has-affixes) > .v-slide-group__prev,
.v-slide-group:not(.v-slide-group--has-affixes) > .v-slide-group__next {
  display: none !important;
}
::v-deep .favorites.v-tabs {
  max-width: calc(100vw - 130px);
}
::v-deep .meaning-result.v-tabs {
  max-width: calc(100vw - 150px);
}
.active-result-tab {
  background-color: #111116;
}
.defintion-box {
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  max-height: 170px;
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
::v-deep .theme--dark.v-tabs .v-tab:hover::before {
  opacity: 0;
}
</style>

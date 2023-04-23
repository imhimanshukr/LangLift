import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawer: null,
    languageList: null,
    meaning: "",
  },
  mutations: {
    setLanguageList(state, language){
      state.languageList = language
    },
    setTranslatedMeaning(state, meaning){
      state.meaning = meaning
    }
  },
  actions: {
    async getLanguageList({commit}){
      const response = await axios.get("https://raw.githubusercontent.com/haliaeetus/iso-639/master/data/iso_639-1.json");
      const languages = Object.values(response.data);
      const names = languages.map(language => ({name: language.name, sign: language["639-1"]}));
      console.log("names: ", names);
      commit("setLanguageList", names)
    },    
    async translateWord({ commit }, text) {
      const response = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${text.sourceLang}&tl=${text.targetLang}&dt=t&q=${encodeURI(text.sourceText)}`)
      console.log("wordd: ", response);
      commit("setTranslatedMeaning", response.data[0][0][0])
    }
  },
})

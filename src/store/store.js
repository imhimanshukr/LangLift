import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
import moment from "moment";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userName: "",
    languageList: null,
    result: null,
    meaning:[],
    wordAudio:"",
    history: [],
    bookmarks:[],
    wordOfTheDay: null,
  },
  mutations: {
    setLanguageList(state, language){
      state.languageList = language
    },
    setTranslatedResult(state, result){
      state.result = result
    },
    setWordMeaning(state, meaning){
      state.meaning = meaning
    },
    setWordAudio(state, audio){
      state.wordAudio = audio
    },
    setHistory(state, data) {
      state.userName = sessionStorage.getItem("currentLangLiftUser");
      const userData = JSON.parse(localStorage.getItem(`${state.userName.replace(/\s+/g, '')}-LangLiftLoggedIn`));
      let history = userData.history;
      const today = moment().format("dddd, MMMM DD, YYYY");
      const now = moment().format("hh:mm:ss A");
      const newTranslation = {
        id: new Date().getTime().toString(),
        selected: false,
        time: now,
        translation: {
          sourceText: data.sourceText,
          sourceLang: data.sourceLang,
          targetText: data.targetText,
          targetLang: data.targetLang
        }
      };
      if (history.length === 0) {
        history.unshift({
          historyDateTime: today,
          historyData: [newTranslation]
        });
      } else {
        let found = false;
        history.forEach((item) => {
          if (item.historyDateTime === today) {
            item.historyData.unshift(newTranslation);
            found = true;
          }
        });
        if (!found) {
          history.unshift({
            historyDateTime: today,
            historyData: [newTranslation]
          });
        }
      }
      userData.history = history;
      localStorage.setItem(`${state.userName.replace(/\s+/g, '')}-LangLiftLoggedIn`, JSON.stringify(userData));
      state.history = userData.history;
    },
    setBookmark(state, bookmark){
      state.userName = sessionStorage.getItem("currentLangLiftUser");
      const userData = JSON.parse(localStorage.getItem(`${state.userName.replace(/\s+/g, '')}-LangLiftLoggedIn`));
      const newBookmark = {
        id: new Date().getTime().toString(),
        data: moment().format("dddd, MMMM DD, YYYY"),
        audio: state.wordAudio,
        sourceText: bookmark.sourceText,
        targetText: bookmark.targetText,
        sourceLang: bookmark.sourceLang,
        targetLang: bookmark.targetLang,
        meaning: bookmark.meaning
      }
      userData.bookmarks.push(newBookmark);
      localStorage.setItem(`${state.userName.replace(/\s+/g, '')}-LangLiftLoggedIn`, JSON.stringify(userData));
      state.bookmarks = userData.bookmarks;
    },
    setWordOfTheDay(state, data){
      state.wordOfTheDay = data;
    }
  },
  actions: {
    async getLanguageList({commit}){
      const response = await axios.get("https://raw.githubusercontent.com/haliaeetus/iso-639/master/data/iso_639-1.json");
      const languages = Object.values(response.data);
      const names = languages.map(language => ({name: language.name, sign: language["639-1"]}));
      commit("setLanguageList", names)
    },
    async translateWord({ commit, dispatch  }, text) {
      const response = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${text.sourceLang.sign}&tl=${text.targetLang.sign}&dt=t&q=${encodeURI(text.sourceText)}`)
      let translatedResult = response.data[0]?.reduce((acc, curr) => {
        if (curr[0]) {
          acc += curr[0];
        }
        return acc;
      }, "");
      if(translatedResult && text.sourceText){
        commit("setTranslatedResult", translatedResult)
        if(text.targetLang.sign === 'en'){
          dispatch("getWordMeaning", translatedResult);
        } 
        if(text.sourceLang.sign === 'en'){
          dispatch("getWordMeaning", text.sourceText);
        }
        if(text.sourceLang.sign !== text.targetLang.sign){
          commit("setHistory", {sourceText: text.sourceText, sourceLang: text.sourceLang, targetText: translatedResult, targetLang: text.targetLang})
        }
      }
    },
    async getWordMeaning({commit}, word){
      commit("setWordMeaning", []);
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if(!response.title && response){
        let uniquePartsOfSpeech = [...new Set(response.data[0].meanings.map(item => item.partOfSpeech))];
        uniquePartsOfSpeech = uniquePartsOfSpeech.map(pos => ({
          partOfSpeech: pos,
          definitions: response.data[0].meanings.filter(item => item.partOfSpeech === pos).flatMap(item => item.definitions),
          synonyms: response.data[0].meanings.filter(item => item.partOfSpeech === pos).flatMap(item => item.synonyms),
          antonyms: response.data[0].meanings.filter(item => item.partOfSpeech === pos).flatMap(item => item.antonyms),
      }));
        for(let i=0; i<response.data.length; i++){
          for(let j=0; j<response.data[i].phonetics.length; j++){
            if(response.data[i].phonetics[j].audio){
              commit("setWordAudio", response.data[i].phonetics[j].audio);
              break;
            }
          }
          break;
        }
        commit("setWordMeaning", uniquePartsOfSpeech);
      }
    },
    async setBookmarkData({commit}, bookmarkData){
      commit("setBookmark", bookmarkData)
    },  
    async getWordOfTheDay({commit}){
      const api_key = 'des0ruq4epok90di59jwn1aff5cauids5mxlpcx1rgnkvlmwy';
      const response = await axios.get(`https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=${api_key}`);
      if(response.status === 200){
        commit("setWordOfTheDay", response.data)
      }
    },
  },
})

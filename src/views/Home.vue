<template>
    <v-container fluid>
        <div class=" mt-4 d-flex align-center">
            <h3 class="fs-14 mr-3 text-no-wrap white--text">Your Favorites</h3>
            <v-tabs background-color="transparent" center-active>
                <v-tab class="favorite-tab mr-3" :class="item.active ? 'active-tab' : ''" v-for="(item, index) in favorite"
                    :key="index" @click="selectFavorite(item)">{{
                        item.from.name }} - {{ item.to.name }}</v-tab>
            </v-tabs>
        </div>
        <v-row class="mt-1 relative">
            <v-col cols="12" md="6">
                <div class="pa-5 secondary-bg rounded-xl">
                    <div class="d-flex align-center">
                        <h4 class="fs-14 primary-text mr-3">From</h4>
                        <v-autocomplete :items="$store.state.languageList" v-model="sourceLang" filled rounded hide-details
                            dark item-text="name" item-value="sign" prepend-inner-icon="mdi-web" class="lang"
                            @change="getSourceLang"></v-autocomplete>
                    </div>
                    <v-textarea rows="4" filled hide-details color="#1B1B1F" dark rounded auto-grow
                        class="no-focus-outline mt-4" v-model="fromText" placeholder="Enter Text"></v-textarea>
                    <div class="d-flex justify-end mt-4">
                        <v-icon class="pa-3 fs-16 rounded-xl pointer" :class="favoriteActive ? 'skyblue-bg' : 'primary-bg'"
                            @click="addFavorite">{{ favoriteActive ? 'mdi-cards-heart' : 'mdi-heart-outline' }}</v-icon>
                        <v-icon class="pa-3 fs-16 ml-2 rounded-xl pointer" :class="activeMic ? 'skyblue-bg' : 'primary-bg'"
                            @click="record()">mdi-microphone</v-icon>
                            <audio ref="audioElement" src="../assets/sound1.mp3"></audio>
                    </div>
                </div>
            </v-col>
            <v-icon class="pa-3 fs-16 rounded-xl pointer skyblue-bg absolute"
                style="left: 50%; top: 50%; transform: translate(-50%, -40%);border: 5px solid #111116;"
                @click="swapLanguage">mdi-swap-horizontal</v-icon>
            <v-col cols="12" md="6">
                <div class="pa-5 secondary-bg rounded-xl">
                    <div class="d-flex align-center">
                        <h4 class="fs-14 primary-text mr-3">Into</h4>
                        <v-autocomplete :items="$store.state.languageList" v-model="targetLang" filled rounded hide-details
                            dark item-text="name" item-value="sign" prepend-inner-icon="mdi-web" class="lang"
                            @change="getTargetLang"></v-autocomplete>
                    </div>
                    <v-textarea rows="4" filled hide-details color="#1B1B1F" dark rounded auto-grow
                        class="no-focus-outline mt-4" v-model="$store.state.meaning" placeholder="Translation"></v-textarea>
                    <div class="d-flex justify-end align-center mt-4">
                        <div class="d-flex">
                            <div @click="speak()">
                                <v-icon class="pa-3 fs-16 rounded-xl pointer"
                                    :class="activeSpeaker ? 'skyblue-bg' : 'primary-bg'">mdi-volume-high</v-icon>
                                <speech :text="text" ref="speech"></speech>
                            </div>
                                <v-icon class="pa-3 fs-16 rounded-xl ml-2 pointer" @click="copyText" :class="isCopied ? 'skyblue-bg' : 'primary-bg'">{{isCopied ? 'mdi-check' : 'mdi-content-copy'}}</v-icon>
                            <v-icon class="pa-3 fs-16 ml-2 rounded-xl pointer primary-bg">mdi-bookmark-outline</v-icon>
                        </div>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import { mapActions } from 'vuex';
import Speech from 'vue-speech';
// import { slugify } from 'transliteration'

export default {
    name: "HomePage",
    data() {
        return {
            favorite: [],
            sourceLang: {},
            targetLang: {},
            fromText: "",
            intoText: "",
            activeMic: false,
            activeSpeaker: false,
            favoriteActive: false,
            text: '',
            isCopied: false,
            recognition: null,
            message: "",
        }
    },
    mounted() {
        this.getLanguageList();
        const favorite = JSON.parse(localStorage.getItem("setFavLangComboList"));
        if (favorite) {
            this.favorite = favorite;
            this.sourceLang = {
                name: this.favorite[0].from.name,
                sign: this.favorite[0].from.sign
            }
            this.targetLang = {
                name: this.favorite[0].to.name,
                sign: this.favorite[0].to.sign
            };
            this.checkFavorite();
        } else {
            this.sourceLang = {
                name: 'English',
                sign: 'en'
            }
            this.targetLang = {
                name: 'Hindi',
                sign: 'hi'
            };
        }
    },
    methods: {
        ...mapActions(["getLanguageList", "translateWord"]),
        swapLanguage() {
            const targetLang = this.targetLang;
            this.targetLang = this.sourceLang;
            this.sourceLang = targetLang;
            const intoText = this.$store.state.meaning;
            this.$store.state.meaning = "";
            this.fromText = intoText;
            this.checkFavorite();
        },
        addFavorite() {
            const index = this.favorite.findIndex((item) => {
                return item.from.name === this.sourceLang.name && item.to.name === this.targetLang.name;
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
                    }
                });
                this.favorite = favorite;
            } else {
                this.favorite.splice(index, 1);
                this.favoriteActive = false;
            }
            this.checkFavorite()
            localStorage.setItem("setFavLangComboList", JSON.stringify(this.favorite));
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
            this.fromText = "";
            this.checkFavorite();
        },
        getTargetLang(event) {
            const targetLang = this.getLanguageInfo(event);
            this.targetLang = targetLang;
            this.checkFavorite();
        },
        getLanguageInfo(language) {
            return this.$store.state.languageList.find(lang => lang.sign === language || language?.from?.sign)
        },
        checkFavorite() {
            this.favoriteActive = false;
            this.favorite = this.favorite.map((item) => {
                return {
                    ...item, active: false
                };
            });
            const index = this.favorite.findIndex((item) => {
                return item.from.name === this.sourceLang.name && item.to.name === this.targetLang.name;
            });
            if (index !== -1) {
                this.favorite[index].active = true;
                this.favoriteActive = true;
            }
        },
        record(){
            this.activeMic = !this.activeMic;
            if(this.activeMic){
                this.$refs.audioElement.play();
                this.fromText = "";
                // eslint-disable-next-line no-undef
                this.recognition = new webkitSpeechRecognition();
                this.recognition.lang = "en-US";
                this.recognition.onresult = event => {
                    const results = event.results[event.resultIndex];
                    const transcript = results[0].transcript;
                    this.fromText += transcript;
                };
                this.recognition.start();
            } else {
                this.recognition.stop();
            }
        },
        speak() {
            this.activeSpeaker = !this.activeSpeaker;
            if (this.activeSpeaker && this.$store.state.meaning) {
                // const latinText = slugify(this.$store.state.meaning)
                // console.log("latin: ", latinText);
                // const utterance = new SpeechSynthesisUtterance(latinText);
                const utterance = new SpeechSynthesisUtterance(this.$store.state.meaning);
                console.log("utterance: ", utterance);
                utterance.lang = "hi-IND";
                speechSynthesis.speak(utterance);
            }
        },
        copyText(){
            if(this.$store.state.meaning){
                navigator.clipboard.writeText(this.$store.state.meaning)
                this.isCopied = true;
                setTimeout(() => {
                    this.isCopied = false;
                }, 1000);
            }
        },
        reset() {
            this.activeMic = false;
            this.activeSpeaker = false;
            this.fromText = "";
            this.checkFavorite();
        }

    },
    watch: {
        fromText(sourceText) {
            if (sourceText && this.targetLang) {
                this.translateWord({ sourceLang: this.sourceLang.sign || this.sourceLang, targetLang: this.targetLang.sign || this.targetLang, sourceText })
            } else {
                this.$store.state.meaning = "";
            }
        },
        targetLang(targetLang) {
            if (targetLang && this.sourceLang) {
                this.translateWord({ sourceLang: this.sourceLang.sign || this.sourceLang, targetLang: targetLang.sign || targetLang, sourceText: this.fromText })
            } else {
                this.$store.state.meaning = "";
            }
        },
    },
    components: {
        Speech,
    }
}
</script>
<style scoped>
.favorite-tab {
    font-size: 12px;
    color: #fff !important;
    border: 1px solid #5F5F63;
    border-radius: 30px;
    text-transform: capitalize;
    height: 35px;
}

.active-tab {
    background: #346AFF;
    border-color: #346AFF;
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

::v-deep .theme--dark.v-text-field--filled>.v-input__control>.v-input__slot {
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
</style>
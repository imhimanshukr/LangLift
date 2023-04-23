<template>
    <v-container fluid>
        <div class=" mt-4 d-flex align-center">
            <h3 class="fs-14 mr-3 text-no-wrap white--text">Your Favorites</h3>
            <v-tabs background-color="transparent" center-active>
                <v-tab class="favorite-tab mr-3" active-class="active-tab" v-for="(item, index) in favorute" :key="index">{{
                    item.from }} - {{ item.to }}</v-tab>
            </v-tabs>
        </div>
        <v-row class="mt-1 relative">
            <v-col cols="12" md="6">
                <div class="pa-5 secondary-bg rounded-xl">
                    <div class="d-flex align-center">
                        <h4 class="fs-14 primary-text mr-3">From</h4>
                        <v-select :items="$store.state.languageList" v-model="sourceLang" filled rounded hide-details dark item-text="name" item-value="sign"
                            prepend-inner-icon="mdi-web"></v-select>
                    </div>
                    <v-textarea rows="4" filled hide-details color="#1B1B1F" dark rounded auto-grow
                        class="no-focus-outline mt-4" v-model="fromText" placeholder="Enter Text"></v-textarea>
                    <div class="d-flex justify-end mt-4">
                        <v-icon class="pa-3 fs-16 rounded-xl pointer" :class="activeMic ? 'skyblue-bg' : 'primary-bg'"
                            @click="activeMic = !activeMic">mdi-microphone</v-icon>
                    </div>
                </div>
            </v-col>
            <v-icon class="pa-3 fs-16 rounded-xl pointer skyblue-bg absolute"
                style="left: 50%; top: 50%; transform: translate(-50%, -40%);border: 5px solid #111116;">mdi-swap-horizontal</v-icon>
            <v-col cols="12" md="6">
                <div class="pa-5 secondary-bg rounded-xl">
                    <div class="d-flex align-center">
                        <h4 class="fs-14 primary-text mr-3">Into</h4>
                        <v-select :items="$store.state.languageList" v-model="targetLang" filled rounded hide-details dark item-text="name" item-value="sign"
                            prepend-inner-icon="mdi-web"></v-select>
                    </div>
                    <v-textarea rows="4" filled hide-details color="#1B1B1F" dark rounded auto-grow
                        class="no-focus-outline mt-4" v-model="$store.state.meaning" placeholder="Translation"></v-textarea>
                    <div class="d-flex justify-end align-center mt-4">
                        <div>
                            <v-icon class="pa-3 fs-16 rounded-xl pointer"
                                :class="activeSpeaker ? 'skyblue-bg' : 'primary-bg'"
                                @click="activeSpeaker = !activeSpeaker">mdi-volume-high</v-icon>
                            <v-icon class="pa-3 fs-16 rounded-xl ml-2 pointer primary-bg">mdi-content-copy</v-icon>
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

export default {
    name: "HomePage",
    data() {
        return {
            favorute: [
                {
                    from: "English",
                    to: "Hindi",
                },
                {
                    from: "English",
                    to: "Telgu",
                },
                {
                    from: "Hindi",
                    to: "Telgu",
                },
            ],
            sourceLang: "English",
            targetLang: "Hindi",
            fromText: "",
            intoText: "",
            activeMic: false,
            activeSpeaker: false,
        }
    },
    mounted() {
        this.getLanguageList();
        console.log("Language: ", this.$store.state.languageList);

    },
    methods: {
        ...mapActions(["getLanguageList", "translateWord"])
    },
    watch: {
        fromText(sourceText) {
            this.translateWord({ sourceLang: this.sourceLang, targetLang: this.targetLang, sourceText })
        },
        // intoText(){
        //     return this.$store.state.meaning
        // }
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
</style>
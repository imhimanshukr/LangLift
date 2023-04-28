<template>
    <v-container class="py-0">
    <v-row no-gutters class="h-100 align-center">
        <v-col
            sm="6"
            class="hide-on-mobile"
        >
        <v-card color="#202B3B" class="d-flex justify-center align-center rounded-xl" height="100%">
            <img src="../assets/logo.png" alt="" width="100%" style="padding: 100px;">
        </v-card>
    </v-col>
    <v-col cols="12" sm="6">
        <div class="d-flex align-center flex-column">
                <img src="../assets/logo.png" alt="" width="60px" class="mb-5">
                <h2 class="fs-40 fw-600 white--text">LangLift</h2>
                <p class="white--text">Dictionary App</p>
                <v-text-field
                    placeholder="Enter you name"
                    dark
                    filled
                    dense
                    rounded
                    v-model="userName"
                    :rules="[rules.required, rules.min]"
                    hint="At least 3 characters"
          ></v-text-field>
                <v-btn rounded class="fs-10" style="width:230px; background-color: rgba(255, 255, 255, 0.08);color: grey;" @click="getStarted">Get started</v-btn>
            </div>
        </v-col>
    </v-row>
</v-container>
</template>
<script>
export default {
    name: "LoginPage",
    data: () => ({
        userName: "",
        rules: {
          required: value => !!value || 'Please enter name.',
          min: v => v.length >= 3 || 'Min 3 characters',
        }
    }),
    methods:{
        getStarted(){
            if(this.userName.length >=3){
			let userData = JSON.parse(localStorage.getItem(`${this.userName.replace(/\s+/g, '')}-LangLiftLoggedIn`))
                if(userData?.userName == this.userName){
                    userData.loggedIn = true;
                    localStorage.setItem(`${this.userName.replace(/\s+/g, '')}-LangLiftLoggedIn`, JSON.stringify(userData));
                    sessionStorage.setItem("currentLangLiftUser", this.userName);
                    this.$store.state.userName = this.userName;
                    this.$router.push("/")
                } else {
                    userData = {
                        userName: this.userName,
                        favorite: [],
                        history: [],
                        bookmarks: [],
                        loggedIn: true
                    }
                    sessionStorage.setItem("currentLangLiftUser", this.userName);
                    this.$store.state.userName = this.userName;
                    localStorage.setItem(`${this.userName.replace(/\s+/g, '')}-LangLiftLoggedIn`, JSON.stringify(userData));
                    this.$router.push("/")
                }
            }
        },
    }
    
}
</script>

<style scoped>

</style>
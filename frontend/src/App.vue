<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
// import axios from "axios"

export default {
  name: 'App',
  components(){
    HelloWorld
  },
  // data(){
  //   return{
  //     userData:[]
  //   }
  // },
  // async mounted(){
  //   let userData = await axios.get("http://localhost:3000/api/user/login/")
  //   console.log(userData.data.data);
  //   this.userData = userData.data.data
  // }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

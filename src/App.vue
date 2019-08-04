<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <a :href="loginURL"><button>Log In</button></a>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({})
  export default class App extends Vue {
    private scopes = 'user-library-read';
    private loginURL = 'https://accounts.spotify.com/authorize?client_id=1dcb962ce1c5437baecc403b9fa1ae5e' +
    `&response_type=code&scope=${encodeURIComponent(this.scopes)}&redirect_uri=http://localhost:8080/login`;
  }
</script>


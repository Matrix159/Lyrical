<template>
  <div class="app">
    <div class="nav">
      <div>
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </div>
      <a :href="loginURL"><button class="login-button">Log In</button></a>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">

  $font-color: rgb(235, 235, 235);

  .app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: $font-color;
  }
  .nav {
    display: flex;
    justify-content: space-between;
    padding: 30px;
    a {
      font-weight: bold;
      color: #8bbed6;
      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
  .login-button {
    color: $font-color;
    background-color: green;
    border: 1px solid black;
    border-radius: 4px;
    height: 3em;
    font-size: 16px;
    width: 5em;
    -webkit-transition-duration: 0.5s; /* Safari */
    transition-duration: 0.5s;

    &:hover {
      background-color: $font-color;
      color: green;
    }
  }
  body {
    background-color: #3a393e;
    height: 100vh;
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


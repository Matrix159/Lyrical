<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <div>{{information}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue';
 // @ is an alias to /src
import axios from 'axios';

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {

  private information = 'Test';
  public mounted() {
    axios.get('http://localhost:3000/me')
      .then((response: any) => (console.log(response)))
      .catch((error: any) => console.log(error));
  }
}
</script>

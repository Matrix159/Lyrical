<template>
  <div class="home">
    <img class="user-profile-image" alt="User profile image" :src="imageURL">
    <p>{{userInfo.display_name || ''}}</p>
  </div>
</template>

<style scoped lang="scss">
  .user-profile-image {
    width: 60px;
    height: 60px;
    border-radius: 25px;
  }
</style>
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

  public userInfo: any = {};

  get imageURL() {
    if (this.userInfo && this.userInfo.images && this.userInfo.images[0]) {
      return this.userInfo.images[0].url;
    } else {
      return this.backupImageURL;
    }
  }
  get backupImageURL() {
    return require('../assets/logo.png');
  }

  public mounted() {
    axios.get('http://localhost:3000/me')
      .then((response: any) => this.userInfo = response.data)
      .catch((error: any) => console.log(error));
  }
}
</script>

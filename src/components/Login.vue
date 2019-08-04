<template></template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { login, JWT } from '@/shared/axios_helpers';


@Component({})
export default class Login extends Vue {
  public mounted() {
    const code = this.$route.query.code as string;
    login(code).then((response: any) => {
        localStorage.setItem(JWT, response.data.jwt);
        this.$router.replace({name: 'home'});
    })
    .catch((error: any) => console.log(error));
  }
}
</script>

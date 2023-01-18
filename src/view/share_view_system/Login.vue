<template>
    <div>
        <input type="email" :value="email" placeholder="メールアドレス" name="email"><br />
        <input type="password" :value="password" placeholder="パスワード" name="password"><br />
        <v-btn @click.once="login">ログイン</v-btn><br />
        <a @click="reset_password">パスワードリセット</a><br />
        <a @click="$router.back()">戻る</a><br />
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import API from './api';

export default class Login extends Vue {
    email: string
    password: string

    login() {
        let api = new API()
        api.login(this.email, this.password)
            .then((error) => {
                if (!error) {
                    //TODO エラーが有ったときの処理
                    return
                } else {
                    this.$router.push('/')
                }
            })
    }

    reset_password() {
        this.$router.push('/reset_password')
    }
}
</script>

<style scoped>

</style>
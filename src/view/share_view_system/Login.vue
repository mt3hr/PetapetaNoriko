<template>
    <div>
        <input type="email" v-model="email" placeholder="メールアドレス" name="email"><br />
        <input type="password" v-model="password" placeholder="パスワード" name="password"><br />
        <v-btn @click.once="login">ログイン</v-btn><br />
        <a @click="register">新規登録</a><br />
        <a v-if="false" @click="reset_password">パスワードリセット</a><br />
        <a @click="$router.back()">戻る</a><br />
        <v-snackbar v-model="show_error_message_snackbar">{{ error_message }}</v-snackbar>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import API from './api';

export default class Login extends Vue {
    email: string
    password: string

    error_message = ""
    show_error_message_snackbar = false

    login() {
        let api = new API()
        api.login(this.email, this.password)
            .then((res) => {
                if (!res.error) {
                    this.error_message = res.error
                    this.show_error_message_snackbar = true
                    return
                } else {
                    this.$router.push('/')
                }
            })
    }

    reset_password() {
        this.$router.push('/reset_password')
    }

    register() {
        this.$router.push('/register')
    }
}
</script>

<style scoped>

</style>
<template>
    <div>
        <div v-if="!registed">
            <input type="text" v-model="username" placeholder="ユーザ名" name="username"><br />
            <input type="email" v-model="email" placeholder="メールアドレス" name="email"><br />
            <input type="password" v-model="password" placeholder="パスワード" name="password"><br />
            <input type="password" v-model="password_retype" placeholder="パスワード（再入力）"><br />
            <v-btn @click.once="register">登録</v-btn><br />
            <a @click="$router.back()">戻る</a><br />
            <v-snackbar v-model="show_error_message_snackbar">{{ error_message }}</v-snackbar>
        </div>
        <div v-else>
            <p>登録完了</p>
            <a @click="$router.replace('/login')">ログイン画面</a>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import API from './api';

export default class Login extends Vue {
    username: string
    email: string
    password: string
    password_retype: string

    error_message = ""
    show_error_message_snackbar = false

    registed = false

    register() {
        if (this.password != this.password_retype) {
            this.error_message = "入力されたパスワードが一致しません"
            this.show_error_message_snackbar
            return
        }

        let api = new API()
        api.register(this.email, this.password, this.username)
            .then((response) => {
                if (response.error) {
                    this.error_message = response.error
                    this.show_error_message_snackbar = true
                    return
                } else {
                    this.registed = true
                }
            })
    }

    reset_password() {
        this.$router.replace('/reset_password')
    }
}
</script>

<style scoped>

</style>
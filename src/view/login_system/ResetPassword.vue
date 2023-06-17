<template>
    <div>
        <h1><a @click="to_toppage" :style="title_style">PutPullMock</a></h1>
        <div v-if="!is_reseted">
            <h2>PPMK パスワードリセット</h2>
            <input type="text" readonly="true" v-model="email" placeholder="メールアドレス"><br>
            <input type="password" v-model="password" placeholder="新パスワード"><br>
            <input type="password" v-model="password_retype" placeholder="新パスワード再入力"><br>
            <v-btn @click.once="submit">送信</v-btn>
        </div>
        <div v-else>
            <h2>PPMK パスワードリセット</h2>
            <p>パスワードがリセットされました</p>
            <a href="/">トップページ</a>
        </div>
        <v-snackbar v-model="show_error_message_snackbar">{{ error_message }}</v-snackbar>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import API from './api';

export default class ResetPassword extends Vue {
    reset_password_id = ""
    email = ""
    password = ""
    password_retype = ""
    error_message = ""
    show_error_message_snackbar = false
    is_reseted = false

    api = new API()

    mounted(): void {
        this.reset_password_id = this.$route.query["reset_password_id"] as string
        this.api.get_reset_password_id_info(this.reset_password_id)
            .then((res) => {
                if (res.error != "") {
                    this.error_message = res.error
                    this.show_error_message_snackbar = true
                } else {
                    this.email = res.email
                }
            })
    }

    async submit() {
        if (this.password != this.password_retype) {
            this.error_message = "再入力されたパスワードが一致しません"
            this.show_error_message_snackbar = true
            return
        }

        let res = await this.api.reset_password(this.reset_password_id, this.email, this.password)
        if (res.error != "") {
            this.error_message = res.error
            this.show_error_message_snackbar = true
        } else {
            this.error_message = "パスワードがリセットされました"
            this.show_error_message_snackbar = true
            this.is_reseted = true
        }
    }

    to_toppage() {
        this.$router.push("/")
    }

    get title_style(): any {
        return { 'color': 'black', 'text-decoration': 'none', 'cursor': 'pointer' }
    }
}
</script>

<style scoped></style>
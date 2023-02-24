<template>
    <div>
        <div v-if="!sent_reset_password_mail">
            <input type="email" v-model="email" placeholder="メールアドレス"><br />
            <v-btn @click.once="reset_password" :disabled="!enable_reset_password_button">{{ reset_password_button_text }}</v-btn><br />
        </div>
        <div v-else>
            <p>パスワードリセットメールを送信しました</p><br />
        </div>
        <v-snackbar v-model="show_error_message_snackbar">{{ error_message }}</v-snackbar>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import API from './api';

export default class ResetPassword extends Vue {
    email: string
    sent_reset_password_mail = false

    error_message = ""
    show_error_message_snackbar = false
    reset_password_button_text = "パスワードリセットメール送信"
    enable_reset_password_button = true

    reset_password() {
        this.reset_password_button_text = "メール送信中..."
        this.enable_reset_password_button = false
        let api = new API()
        api.request_reset_password(this.email)
            .then((res) => {
                if (res.error) {
                    this.error_message = res.error
                    this.show_error_message_snackbar = true
                    return
                } else {
                    this.sent_reset_password_mail = true
                }
            })
    }
}
</script>

<style scoped>

</style>
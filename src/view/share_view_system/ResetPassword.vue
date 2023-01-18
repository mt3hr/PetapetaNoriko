<template>
    <div>
        <div v-if="!sent_reset_password_mail">
            <input type="email" :value="email" placeholder="メールアドレス"><br />
            <v-btn @click.once="reset_password">パスワードリセットメール送信</v-btn><br />
            <a @click="$router.back()">戻る</a><br />
        </div>
        <div v-else>
            <p>パスワードリセットメールを送信しました</p><br />
            <a @click="$router.back()">戻る</a><br />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import API from './api';

export default class ResetPassword extends Vue {
    email: string
    sent_reset_password_mail = false

    reset_password() {
        let api = new API()
        api.reset_password(this.email)
            .then((error) => {
                if (error) {
                    //TODO エラーがあった場合の処理
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
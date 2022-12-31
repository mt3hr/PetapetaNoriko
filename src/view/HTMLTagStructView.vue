<template>
    <div>
        <h2>構造</h2>
        <ul>
            <HTMLTagStructViewLi :html_tagdatas="html_tagdatas" @updated_html_tagdatas="updated_html_tagdatas" />
        </ul>
    </div>
</template>
<script lang="ts">
import HTMLTagDataBase from '@/html_tagdata/HTMLTagDataBase';
import { Options, Vue } from 'vue-class-component';
import HTMLTagStructViewLi from '@/view/HTMLTagStructViewLi.vue'

@Options({
    components: {
        HTMLTagStructViewLi,
    }
})
export default class HTMLTagPropertyView extends Vue {
    html_tagdatas: Array<HTMLTagDataBase> = new Array<HTMLTagDataBase>()

    updated_html_tagdatas(html_tagdatas: Array<HTMLTagDataBase>) {
        this.$emit("updated_html_tagdatas", html_tagdatas)
    }
}
</script>
<style scoped>
li {
    margin-left: 20px;
}
</style>
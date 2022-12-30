<template>
    <div>
        <li @contextmenu.prevent="is_show_contextmenu = true" @click="clicked_page">
            {{ pagedata.pagename }}</li>
        <v-menu v-model="is_show_contextmenu" :activator="this">
            <v-list>
                <v-list-item @click="delete_page()">削除</v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import PageData from './PageData';

export default class PageListItem extends Vue {
    @Prop() pagedata: PageData
    is_show_contextmenu = false

    clicked_page() {
        this.$emit('clicked_page', this.pagedata)
    }
    delete_page() {
        this.$emit('delete_page', this.pagedata)
    }
}
</script>

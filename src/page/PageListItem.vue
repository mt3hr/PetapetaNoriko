<template>
    <div>
        <li @contextmenu.prevent="show_contextmenu" @click="clicked_page">
            {{ pagedata.pagename }}</li>
        <v-menu v-model="is_show_contextmenu" :style="contextmenu_style">
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
    x_contextmenu = 0
    y_contextmenu = 0

    clicked_page() {
        this.$emit('clicked_page', this.pagedata)
    }
    delete_page() {
        this.$emit('delete_page', this.pagedata)
    }
    show_contextmenu(e: MouseEvent) {
        e.preventDefault()
        this.x_contextmenu = e.clientX
        this.y_contextmenu = e.clientY
        this.is_show_contextmenu = true
    }

    get contextmenu_style(): any {
        return {
            position: "absolute",
            left: this.x_contextmenu + "px",
            top: this.y_contextmenu + "px",
        }
    }

}
</script>

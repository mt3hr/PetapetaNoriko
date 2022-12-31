<template>
    <div>
        <h2>
            ページ一覧
            <v-btn @click="add_page">+</v-btn>
        </h2>
        <ul>
            <PageListItem v-for="(pagedata, index) in pagedatas" :pagedata="pagedata" :key="index"
                :style="generate_style(index)" @clicked_page="clicked_page" @delete_page="delete_page" />
        </ul>
    </div>
</template>
<script lang="ts">
import PageData from '@/page/PageData';
import PageListItem from '@/page/PageListItem.vue';
import { Options, Vue } from 'vue-class-component';


@Options({
    components: {
        PageListItem,
    }
})
export default class Page extends Vue {
    selected_index = 0
    pagedatas: Array<PageData> = new Array<PageData>()

    clicked_page(pagedata: PageData) {
        for (let i = 0; i < this.pagedatas.length; i++) {
            if (pagedata.pageid == this.pagedatas[i].pageid) {
                this.selected_index = i
                break
            }
        }
        this.$emit('clicked_page', pagedata)
    }

    delete_page(pagedata: PageData) {
        let deleteindex = -1
        for (let i = 0; i < this.pagedatas.length; i++) {
            if (pagedata.pageid == this.pagedatas[i].pageid) {
                deleteindex = i
                break
            }
        }
        if (deleteindex != -1) {
            this.pagedatas.splice(deleteindex, 1)
            this.$emit('delete_page', pagedata)
        }
    }

    created(): void {
        this.add_page()
    }

    generate_style(index: number): any {
        if (index == this.selected_index) {
            return {
                "font-weight": "bold"
            }
        }
        return {}
    }

    add_page() {
        let pagedata = new PageData()
        this.pagedatas.push(pagedata)
        this.$nextTick(() => {
            this.clicked_page(pagedata)
        })
    }
}
</script>

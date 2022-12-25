<template>
    <div>
        <h2>ページ一覧</h2>
        <ul>
            <li v-for="(pagedata, index) in pagedatas" @click="clicked_page(index)" :key="index"
                :style="generate_style(index)">{{ pagedata.pagename }}</li>
        </ul>
    </div>
</template>
<script lang="ts">
import PageData from '@/page/PageData';
import { Vue } from 'vue-class-component';

export default class Page extends Vue {
    selected_index = 0
    pagedatas: Array<PageData> = new Array<PageData>()

    clicked_page(index: number) {
        this.selected_index = index
        this.$emit('clicked_page', this.pagedatas[index])
    }

    created(): void {
        //TODO けして
        let page1 = new PageData()
        page1.pagename = "ページ1"
        let page2 = new PageData()
        page2.pagename = "ページ2"
        this.pagedatas.push(page1)
        this.pagedatas.push(page2)
        this.$nextTick(() => {
            this.clicked_page(0)
        })
    }

    generate_style(index: number): any {
        if (index == this.selected_index) {
            return {
                "font-weight": "bold"
            }
        }
        return {}
    }
}
</script>

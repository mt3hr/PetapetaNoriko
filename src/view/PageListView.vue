<template>
    <div>
        <h2>
            ページ一覧
            <v-btn @click="add_page">+</v-btn>
        </h2>
        <ul>
            <PageListItem v-for="(pagedata, index) in pagedatas" :pagedata="pagedata" :key="index"
                @copy_page="(pagedata) => copy_page(pagedata, index)" :style="generate_style(index)"
                @move_pagedata="(e, pagedata) => move_pagedata(e, pagedata, index)" @clicked_page="clicked_page"
                :selected="selected_index == index" @delete_page="delete_page" />
        </ul>
    </div>
</template>
<script lang="ts">
import PageData from '@/page/PageData';
import PageListItem from '@/page/PageListItem.vue';
import { deserialize } from '@/serializable/serializable';
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';


@Options({
    components: {
        PageListItem,
    }
})
export default class Page extends Vue {
    selected_index = 0
    pagedatas: Array<PageData> = new Array<PageData>()
    @Prop() auto_save_pagedatas_to_localstorage: boolean

    @Watch('pagedatas')
    save_pagedatas_to_localstorage() {
        if (this.auto_save_pagedatas_to_localstorage) {
            window.localStorage.setItem("ppmk_pagedatas", JSON.stringify(this.pagedatas))
        }
    }

    @Watch('auto_save_pagedatas_to_localstorage')
    clear_pagedatas_at_localstorage() {
        if (!this.auto_save_pagedatas_to_localstorage) {
            window.localStorage.setItem("ppmk_pagedatas", "")
        }
    }

    clicked_page(pagedata: PageData) {
        for (let i = 0; i < this.pagedatas.length; i++) {
            if (pagedata.pageid == this.pagedatas[i].pageid) {
                this.selected_index = i
                break
            }
        }
        this.$nextTick(() => {
            this.$emit('clicked_page', pagedata)
        })
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
        if (this.auto_save_pagedatas_to_localstorage) {
            try {
                this.pagedatas = JSON.parse(window.localStorage.getItem("ppmk_pagedatas"), deserialize)
                this.clicked_page(this.pagedatas[0])
            } catch (e) {
                this.add_page()
            }
        } else {
            this.add_page()
        }
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

    copy_page(pagedata: any, index: number) {
        this.pagedatas.splice(index + 1, 0, pagedata)
        this.clicked_page(pagedata)
    }

    move_pagedata(e: DragEvent, pagedata: PageData, index: number) {
        if (e.dataTransfer.getData("ppmk/move_page_id") == pagedata.pageid) {
            return
        }

        let json = JSON.stringify(this.pagedatas)
        let pagedatas: Array<PageData> = JSON.parse(json, deserialize)

        let move_pagedata: PageData
        for (let i = 0; i < pagedatas.length; i++) {
            if (e.dataTransfer.getData("ppmk/move_page_id") == pagedatas[i].pageid) {
                move_pagedata = pagedatas[i]
                pagedatas.splice(i, 1)
                break
            }
        }

        pagedatas.splice(index, 0, move_pagedata)
        this.pagedatas = pagedatas
        this.selected_index = index
        this.clicked_page(this.pagedatas[index])
    }
}
</script>

<template>
    <div>
        <h2>ドロップゾーン</h2>
        <div class="dropzone" @drop.stop="on_drop" @dragover.prevent="on_dragover">
            <div v-for="tagdata, index in htmltag_datas" :key="index">
                <HTMLTagView :tagdata="tagdata" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import HTMLTagData from '@/html_tagdata/HTMLTagDataBase'
import HTMLTagView from '@/view/HTMLTagView.vue'
import H1TagData from '@/html_tagdata/H1TagData'

@Options({
    components: {
        HTMLTagView,
    }
})



export default class DropZone extends Vue {
    htmltag_datas: Array<HTMLTagData> = new Array<HTMLTagData>()
    on_dragover(e: DragEvent) {
        if (e.dataTransfer.getData("ppmk/htmltag")) {
            e.dataTransfer.dropEffect = "copy"
        } else if (e.dataTransfer.getData("ppmk/move_tag_id")) {
            e.dataTransfer.dropEffect = "move"
        }
    }
    on_drop(e: DragEvent) {
        if (e.dataTransfer.getData("ppmk/htmltag")) {
            let tagname = e.dataTransfer.getData("ppmk/htmltag")
            let tag_data: HTMLTagData
            // 鬼の条件分岐
            switch (tagname) {
                case "h1":
                    tag_data = new H1TagData()
                    break
            }
            tag_data.position_x = e.x
            tag_data.position_y = e.y
            this.htmltag_datas.push(tag_data)
        } else if (e.dataTransfer.getData("ppmk/move_tag_id")) {
            // すでに配置されたコンポーネントの移動
            let target_tag_id = e.dataTransfer.getData("ppmk/move_tag_id")
            for (let i = 0; i < this.htmltag_datas.length; i++) {
                let htmltag_data = this.htmltag_datas[i]
                if (target_tag_id == htmltag_data.tagid) {
                    htmltag_data.position_x = e.x
                    htmltag_data.position_y = e.y
                    break
                }
            }
            let htmltag_datas = this.htmltag_datas
            this.htmltag_datas = new Array<HTMLTagData>()
            this.$nextTick(() => {
                this.htmltag_datas = htmltag_datas
            })
        }
    }
    generateHTML(): string {
        let html = ""
        html += "<html>"
        for (let i = 0; i < this.htmltag_datas.length; i++) {
            const component = this.htmltag_datas[i]
            html += "  " + component.generate_html()
        }
        html += "</html>"
        return html
    }

    generateHTMLWithID(): string {
        let html = ""
        html += "<html>\n"
        for (let i = 0; i < this.htmltag_datas.length; i++) {
            const component = this.htmltag_datas[i]
            html += "  " + component.generate_html_with_id() + "\n"
        }
        html += "</html>"
        return html
    }

    generateCSS(): string {
        let css = ""
        for (let i = 0; i < this.htmltag_datas.length; i++) {
            const component = this.htmltag_datas[i]
            css += component.generate_position_css()
        }
        return css
    }
}
</script>
<style scoped>
.dropzone {
    height: 1000px;
    width: 900px;
}
</style>
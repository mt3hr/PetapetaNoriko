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
import H2TagData from '@/html_tagdata/H2TagData'
import H3TagData from '@/html_tagdata/H3TagData'
import H4TagData from '@/html_tagdata/H4TagData'
import H5TagData from '@/html_tagdata/H5TagData'
import H6TagData from '@/html_tagdata/H6TagData'

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
                case "h2":
                    tag_data = new H2TagData()
                    break
                case "h3":
                    tag_data = new H3TagData()
                    break
                case "h4":
                    tag_data = new H4TagData()
                    break
                case "h5":
                    tag_data = new H5TagData()
                    break
                case "h6":
                    tag_data = new H6TagData()
                    break
            }
            tag_data.position_x = e.pageX
            tag_data.position_y = e.pageY
            this.htmltag_datas.push(tag_data)
        } else if (e.dataTransfer.getData("ppmk/move_tag_id")) {
            // すでに配置されたコンポーネントの移動
            let target_tag_id = e.dataTransfer.getData("ppmk/move_tag_id")
            for (let i = 0; i < this.htmltag_datas.length; i++) {
                let htmltag_data = this.htmltag_datas[i]
                if (target_tag_id == htmltag_data.tagid) {
                    let offset_x = Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_x"))
                    let offset_y = Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_y"))
                    htmltag_data.position_x = e.pageX - offset_x
                    htmltag_data.position_y = e.pageY - offset_y
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
            html += "  " + component.generate_html(false)
        }
        html += "</html>"
        return html
    }

    generateHTMLWithID(): string {
        let html = ""
        html += "<html>\n"
        for (let i = 0; i < this.htmltag_datas.length; i++) {
            const component = this.htmltag_datas[i]
            html += "  " + component.generate_html(true) + "\n"
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
    overflow-block: hidden;
    /*absoluteがあると効かないらしい？ */
}
</style>
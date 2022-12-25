<template>
    <div>
        <h2>ドロップゾーン</h2>
        <div class="dropzone" @drop.stop="on_drop" @dragover.prevent="on_dragover">
            <div v-for="tagdata, index in html_tagdatas" :key="index">
                <HTMLTagView :tagdata="tagdata" @updated_tagdata="updated_tagdata" />
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
import HTMLTagDataBase from '@/html_tagdata/HTMLTagDataBase'

@Options({
    components: {
        HTMLTagView,
    }
})



export default class DropZone extends Vue {
    html_tagdatas: Array<HTMLTagData> = new Array<HTMLTagData>()

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
            this.html_tagdatas.push(tag_data)
        } else if (e.dataTransfer.getData("ppmk/move_tag_id")) {
            // すでに配置されたコンポーネントの移動
            let target_tag_id = e.dataTransfer.getData("ppmk/move_tag_id")
            for (let i = 0; i < this.html_tagdatas.length; i++) {
                let html_tagdata = this.html_tagdatas[i]
                if (target_tag_id == html_tagdata.tagid) {
                    let offset_x = Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_x"))
                    let offset_y = Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_y"))
                    html_tagdata.position_x = e.pageX - offset_x
                    html_tagdata.position_y = e.pageY - offset_y
                    break
                }
            }
            let html_tagdatas = this.html_tagdatas
            this.html_tagdatas = new Array<HTMLTagDataBase>()
            this.$nextTick(() => {
                this.html_tagdatas = html_tagdatas
                this.updated_tagdata(null)
            })
        }
    }

    updated_tagdata(tagdata: HTMLTagDataBase) {
        if (tagdata) {
            for (let i = 0; i < this.html_tagdatas.length; i++) {
                if (tagdata.tagid == this.html_tagdatas[i].tagid) {
                    this.html_tagdatas[i] = tagdata
                    break
                }
            }
        }
        let html_tagdatas = this.html_tagdatas
        this.html_tagdatas = new Array<HTMLTagDataBase>()
        this.$nextTick(() => {
            this.html_tagdatas = html_tagdatas
            this.$emit('updated_htmltagdatas')
        })
        console.log(tagdata)
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
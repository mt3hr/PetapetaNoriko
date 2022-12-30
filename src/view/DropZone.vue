<template>
    <div>
        <h2>ドロップゾーン</h2>
        <div class="dropzone" @drop.prevent="on_drop" @dragover.prevent="on_dragover" :style="dropzone_style">
            <div v-for="tagdata, index in html_tagdatas" :key="index">
                <HTMLTagView :tagdata="tagdata" @updated_tagdata="updated_tagdata" @onclick_tag="onclick_tag"
                    @delete_tagdata="delete_tagdata" />
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
import LabelTagData from '@/html_tagdata/LabelTagData'
import OptionTagData from '@/html_tagdata/OptionTagData'
import SelectTagData from '@/html_tagdata/SelectTagData'
import TextAreaTagData from '@/html_tagdata/TextAreaTagData'
import WeekTagData from '@/html_tagdata/WeekTagData'
import URLTagData from '@/html_tagdata/URLTagData'
import TimeTagData from '@/html_tagdata/TimeTagData'
import TextTagData from '@/html_tagdata/TextTagData'
import TelTagData from '@/html_tagdata/TelTagData'
import SubmitTagData from '@/html_tagdata/SubmitTagData'
import SearchTagData from '@/html_tagdata/SearchTagData'
import ResetTagData from '@/html_tagdata/ResetTagData'
import RangeTagData from '@/html_tagdata/RangeTagData'
import RadioTagData from '@/html_tagdata/RadioTagData'
import ATagData from '@/html_tagdata/ATagData'
import ButtonTagData from '@/html_tagdata/ButtonTagData'
import ColorTagData from '@/html_tagdata/ColorTagData'
import DateTagData from '@/html_tagdata/DateTagData'
import DateTimeLocalTagData from '@/html_tagdata/DateTimeLocalTagData'
import FileTagData from '@/html_tagdata/FileTagData'
import FormTagData from '@/html_tagdata/FormTagData'
import ImageTagData from '@/html_tagdata/ImageTagData'
import IMGTagData from '@/html_tagdata/IMGTagData'
import LITagData from '@/html_tagdata/LITagData'
import MonthTagData from '@/html_tagdata/MonthTagData'
import NumberTagData from '@/html_tagdata/NumberTagData'
import OLTagData from '@/html_tagdata/OLTagData'
import PasswordTagData from '@/html_tagdata/PasswordTagData'
import PTagData from '@/html_tagdata/PTagData'
import TableTagData from '@/html_tagdata/TableTagData'
import TDTagData from '@/html_tagdata/TDTagData'
import TRTagData from '@/html_tagdata/TRTagData'
import ULTagData from '@/html_tagdata/ULTagData'
import CheckBoxTagData from '@/html_tagdata/CheckBoxTagData'
import EmailTagData from '@/html_tagdata/EmailTagData'
import { Prop } from 'vue-property-decorator'

@Options({
    components: {
        HTMLTagView,
    }
})

export default class DropZone extends Vue {
    html_tagdatas: Array<HTMLTagData> = new Array<HTMLTagData>()
    @Prop() dropzone_style: string

    on_dragover(e: DragEvent) {
        if (e.dataTransfer.items.length != 0) {
            e.dataTransfer.dropEffect = "copy"
        } else if (e.dataTransfer.getData("ppmk/htmltag")) {
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
                case "p":
                    tag_data = new PTagData()
                    break
                case "a":
                    tag_data = new ATagData()
                    break
                case "ul":
                    tag_data = new ULTagData()
                    break
                case "ol":
                    tag_data = new OLTagData()
                    break
                case "li":
                    tag_data = new LITagData()
                    break
                case "img":
                    tag_data = new IMGTagData()
                    break
                case "table":
                    tag_data = new TableTagData()
                    break
                case "tr":
                    tag_data = new TRTagData()
                    break
                case "td":
                    tag_data = new TDTagData()
                    break
                case "form":
                    tag_data = new FormTagData()
                    break
                case "button":
                    tag_data = new ButtonTagData()
                    break
                case "checkbox":
                    tag_data = new CheckBoxTagData()
                    break
                case "color":
                    tag_data = new ColorTagData()
                    break
                case "date":
                    tag_data = new DateTagData()
                    break
                case "datetimelocal":
                    tag_data = new DateTimeLocalTagData()
                    break
                case "email":
                    tag_data = new EmailTagData()
                    break
                case "file":
                    tag_data = new FileTagData()
                    break
                case "image":
                    tag_data = new ImageTagData()
                    break
                case "month":
                    tag_data = new MonthTagData()
                    break
                case "number":
                    tag_data = new NumberTagData()
                    break
                case "password":
                    tag_data = new PasswordTagData()
                    break
                case "radio":
                    tag_data = new RadioTagData()
                    break
                case "range":
                    tag_data = new RangeTagData()
                    break
                case "reset":
                    tag_data = new ResetTagData()
                    break
                case "search":
                    tag_data = new SearchTagData()
                    break
                case "submit":
                    tag_data = new SubmitTagData()
                    break
                case "tel":
                    tag_data = new TelTagData()
                    break
                case "text":
                    tag_data = new TextTagData()
                    break
                case "time":
                    tag_data = new TimeTagData()
                    break
                case "url":
                    tag_data = new URLTagData()
                    break
                case "week":
                    tag_data = new WeekTagData()
                    break
                case "textarea":
                    tag_data = new TextAreaTagData()
                    break
                case "select":
                    tag_data = new SelectTagData()
                    break
                case "option":
                    tag_data = new OptionTagData()
                    break
                case "label":
                    tag_data = new LabelTagData()
                    break
            }
            tag_data.position_x = e.pageX
            tag_data.position_y = e.pageY
            this.html_tagdatas.push(tag_data)
            this.updated_tagdata(tag_data)
        } else if (e.dataTransfer.getData("ppmk/move_tag_id")) {
            // すでに配置されたコンポーネントの移動
            let target_tag_id = e.dataTransfer.getData("ppmk/move_tag_id")
            let html_tagdata: HTMLTagData
            for (let i = 0; i < this.html_tagdatas.length; i++) {
                html_tagdata = this.html_tagdatas[i]
                if (target_tag_id == html_tagdata.tagid) {
                    let offset_x = Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_x"))
                    let offset_y = Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_y"))
                    html_tagdata.position_x = e.pageX - offset_x
                    html_tagdata.position_y = e.pageY - offset_y
                    break
                }
            }
            this.updated_tagdata(html_tagdata)
        } else if (e.dataTransfer.items.length != 0) {
            const reader = new FileReader()
            reader.onload = (event: any) => {
                let tag_data = new IMGTagData()
                tag_data.src = event.currentTarget.result
                tag_data.position_x = e.pageX
                tag_data.position_y = e.pageY
                this.html_tagdatas.push(tag_data)
                this.updated_tagdata(tag_data)
            }
            reader.readAsDataURL(e.dataTransfer.files[0])
        }
        e.preventDefault()
    }

    onclick_tag(tagdata: HTMLTagData) {
        this.$emit('onclick_tag', tagdata)
    }

    updated_tagdata(tagdata: HTMLTagDataBase) {
        for (let i = 0; i < this.html_tagdatas.length; i++) {
            if (tagdata.tagid == this.html_tagdatas[i].tagid) {
                this.html_tagdatas[i] = tagdata
                break
            }
        }
        let html_tagdatas = this.html_tagdatas
        this.html_tagdatas = new Array<HTMLTagDataBase>()
        this.$nextTick(() => {
            this.html_tagdatas = html_tagdatas
            this.$emit('updated_htmltagdatas', html_tagdatas, tagdata)
        })
    }

    delete_tagdata(html_tagdata: HTMLTagDataBase) {
        let index = -1
        for (let i = 0; i < this.html_tagdatas.length; i++) {
            if (html_tagdata.tagid == this.html_tagdatas[i].tagid) {
                index = i
                break
            }
        }
        if (index != -1) {
            this.html_tagdatas.splice(index, 1)
        }
    }
}
</script>
<style scoped>
.dropzone {
    /* height: 750px; */
    /* width: 750px; */
    overflow-block: hidden;
    /*absoluteがあると効かないらしい？ */
}
</style>
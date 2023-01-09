<template>
    <div>
        <component :is="'style'">
            {{ style_user_edited_fixed }}
        </component>
        <h2>ドロップゾーン</h2>
        <div id="dropzone" class="dropzone" @click="onclick" @drop.stop="on_drop" @dragover.prevent="on_dragover"
            :style="dropzone_style" @contextmenu="show_contextmenu">

            <body id="dropzone_body" class="page" :style="dropzone_style">
                <div v-if="!html_tagdatas"
                    :style="{ 'text-align': 'center', 'vertical-align': 'middle', 'height': '-webkit-fill-available' }">
                    <v-btn @click="add_page"
                        :style="{ 'margin': 'auto', 'position': 'rerative', 'top': '45%' }">ページを追加</v-btn>
                </div>
                <HTMLTagView v-for="tagdata, index in html_tagdatas" :key="index" :tagdatas_root="html_tagdatas_root"
                    :clicked_tagdata="clicked_tagdata" :show_border="show_border" :tagdata="tagdata"
                    @updated_tagdatas_root="updated_tagdatas_root" @copy_tag="copy_tag"
                    @updated_tagdata="updated_tagdata" @onclick_tag="onclick_tag" @delete_tagdata="delete_tagdata" />
            </body>
        </div>
        <v-menu v-model="is_show_contextmenu" :style="contextmenu_style">
            <v-list v-if="copied_tagdata.tagname != 'tagbase'">
                <v-list-item @click="paste_tag">貼り付け</v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import HTMLTagDataBase, { PositionStyle } from '@/html_tagdata/HTMLTagDataBase'
import HTMLTagView from '@/view/HTMLTagView.vue'
import IMGTagData from '@/html_tagdata/IMGTagData'
import { Prop } from 'vue-property-decorator'
import { deserialize } from '@/serializable/serializable'
import { generate_tagdata_by_tagname } from './html_tag_view/generate_tagdata_by_tagname'
import generateUUID from '@/uuid'

@Options({
    components: {
        HTMLTagView,
    }
})

export default class DropZone extends Vue {
    html_tagdatas: Array<HTMLTagDataBase> = new Array<HTMLTagDataBase>()
    html_tagdatas_root: Array<HTMLTagDataBase> = new Array<HTMLTagDataBase>()
    style_user_edited = ""
    @Prop() show_border: boolean
    @Prop() dropzone_style: any
    @Prop() clicked_tagdata: HTMLTagDataBase
    @Prop() copied_tagdata: HTMLTagDataBase

    is_show_contextmenu = false
    x_contextmenu = 0
    y_contextmenu = 0

    paste_tag() {
        if (this.copied_tagdata.tagname != 'tagbase') {
            let copied_tagdata: HTMLTagDataBase = JSON.parse(JSON.stringify(this.copied_tagdata), deserialize)
            copied_tagdata.tagid = "id_" + generateUUID()
            let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>) {
                // 後で代入する
            }
            walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>) {
                for (let i = 0; i < tagdatas.length; i++) {
                    tagdatas[i].tagid = "id_" + generateUUID()
                    walk_tagdatas(tagdatas[i].child_tagdatas)
                }
            }
            walk_tagdatas(copied_tagdata.child_tagdatas)
            this.html_tagdatas.push(copied_tagdata)
        }
        this.updated_tagdatas_root(this.html_tagdatas)
    }

    get contextmenu_style(): any {
        return {
            display: "inline",
            position: "absolute",
            left: this.x_contextmenu + "px",
            top: this.y_contextmenu + "px",
        }
    }

    // https://stackoverflow.com/questions/3326494/parsing-css-in-javascript-jquery
    rulesForCssText(styleContent) {
        let doc = document.implementation.createHTMLDocument(""),
            styleElement = document.createElement("style");
        styleElement.textContent = styleContent;
        doc.body.appendChild(styleElement);
        return styleElement.sheet.cssRules;
    }

    get style_user_edited_fixed(): string {
        try {
            let style = ""
            let css_rules: any = this.rulesForCssText(this.style_user_edited)
            for (let i = 0; i < css_rules.length; i++) {
                let css_element = css_rules[i]
                let css_text = css_element.cssText
                let css_text_spl = css_text.split("{")
                let target = css_text_spl[0]
                let rules = "{" + css_text_spl[1]

                let targets = target.split(",")
                for (let j = 0; j < targets.length; j++) {
                    targets[j] = "#dropzone " + targets[j]
                }
                target = targets.join(",")

                style += target + rules + "\n"
            }
            return style
        } catch (error) {
            console.log(error)
            return ""
        }
    }

    on_dragover(e: DragEvent) {
        if (!this.html_tagdatas) {
            e.dataTransfer.dropEffect = 'none'
            return
        }
        if (e.dataTransfer.getData("ppmk/struct_li_id") || e.dataTransfer.getData("ppmk/move_tag_id") ||
            e.dataTransfer.getData("ppmk/htmltag") ||
            e.dataTransfer.items.length != 0
        ) {
            e.dataTransfer.dropEffect = "move"
        }
    }

    on_drop(e: DragEvent) {
        if (e.dataTransfer.getData("ppmk/htmltag")) {
            let tagname = e.dataTransfer.getData("ppmk/htmltag")
            let tag_data: HTMLTagDataBase = generate_tagdata_by_tagname(tagname)
            tag_data.position_x = e.offsetX
            tag_data.position_y = e.offsetY
            this.html_tagdatas.push(tag_data)
            this.updated_tagdata(tag_data)
        } else if (e.dataTransfer.getData("ppmk/move_tag_id")) {
            // すでに配置されたコンポーネントの移動
            let json = JSON.stringify(this.html_tagdatas)
            let html_tagdatas_root = JSON.parse(json, deserialize)
            let move_tagdata: HTMLTagDataBase

            let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean { return false }
            walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                for (let i = 0; i < tagdatas.length; i++) {
                    let html_tagdata = tagdatas[i]
                    if (e.dataTransfer.getData("ppmk/move_tag_id") == tagdatas[i].tagid) {
                        move_tagdata = tagdatas[i]
                        move_tagdata.position_style = PositionStyle.Absolute
                        tagdatas.splice(i, 1)
                        let dropzone_x = document.getElementById("dropzone").getBoundingClientRect().left
                        let dropzone_y = document.getElementById("dropzone").getBoundingClientRect().top
                        html_tagdata.position_x = e.pageX - dropzone_x
                        html_tagdata.position_y = e.pageY - dropzone_y
                        html_tagdata.position_x -= Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_x"))
                        html_tagdata.position_y -= Number.parseInt(e.dataTransfer.getData("ppmk/move_tag_offset_y"))
                        return true
                    }
                    if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                        return true
                    }
                }
                return false
            }
            walk_tagdatas(html_tagdatas_root)
            if (e.shiftKey) {
                html_tagdatas_root.unshift(move_tagdata)
            } else if (e.ctrlKey) {
                html_tagdatas_root.push(move_tagdata)
            } else {
                html_tagdatas_root.push(move_tagdata)
            }

            this.$emit('updated_htmltagdatas', html_tagdatas_root, null)
            e.stopPropagation()
        } else if (e.dataTransfer.items.length != 0) {
            const reader = new FileReader()
            reader.onload = (event: any) => {
                let tag_data = new IMGTagData()
                tag_data.src = event.currentTarget.result
                tag_data.position_x = e.offsetX
                tag_data.position_y = e.offsetY
                this.html_tagdatas.push(tag_data)
                this.updated_tagdata(tag_data)
            }
            reader.readAsDataURL(e.dataTransfer.files[0])
            e.preventDefault()
        }
        e.stopPropagation()
    }

    onclick_tag(tagdata: HTMLTagDataBase) {
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

    delete_tagdata(tagdata: HTMLTagDataBase) {
        let json = JSON.stringify(this.html_tagdatas)
        let html_tagdatas_root = JSON.parse(json, deserialize)

        let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean { return false }
        walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
            for (let i = 0; i < tagdatas.length; i++) {
                let html_tagdata = tagdatas[i]
                if (tagdata.tagid == tagdatas[i].tagid) {
                    tagdatas.splice(i, 1)
                    return true
                }
                if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                    return true
                }
            }
        }
        walk_tagdatas(html_tagdatas_root)
        this.$emit('updated_htmltagdatas', html_tagdatas_root, null)
    }

    updated_tagdatas_root(tagdatas: Array<HTMLTagDataBase>) {
        this.$emit('updated_tagdatas_root', tagdatas, null)
    }

    copy_tag(tagdata: HTMLTagDataBase) {
        this.$emit("copy_tag", tagdata)
    }

    show_contextmenu(e: MouseEvent) {
        e.preventDefault()
        this.x_contextmenu = e.clientX
        this.y_contextmenu = e.clientY
        this.is_show_contextmenu = true
    }

    onclick() {
        this.$emit('onclick_tag', null)
    }

    add_page() {
        this.$emit('add_page')
    }
}
</script>
<style scoped>
.dropzone {
    overflow: hidden;
    position: relative;
}

body {
    overflow-y: hidden !important;
}
</style>
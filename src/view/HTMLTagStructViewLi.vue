<template>
    <li draggable="true" dropzone @drop.stop="(e) => drop(e, tagdata, true)" @contextmenu.stop="show_contextmenu"
        @dragstart.stop="(e) => dragstart(e, tagdata)" @click.stop="() => onclick_tag(tagdata)"
        @dragover.prevent="dragover">
        <span>{{ tagdata.tagname }}:</span>
        <span>({{ tagdata.to_string() }})</span>
        <ul v-if="tagdata.child_tagdatas.length != 0">
            <HTMLTagStructViewLi v-for="child_tagdata, index in tagdata.child_tagdatas" :key="index"
                @copy_tag="copy_tag" :html_tagdatas_root="html_tagdatas_root" :tagdata="child_tagdata"
                @onclick_tag="onclick_tag" @delete_tagdata="delete_tag"
                @updated_html_tagdatas="(tagdatas) => updated_html_tagdatas_child(tagdatas)" />
        </ul>
    </li>
    <v-menu v-model="is_show_contextmenu" :style="contextmenu_style">
        <v-list>
            <v-list-item @click="copy_tag(tagdata)">コピー</v-list-item>
            <v-list-item @click="delete_tag(tagdata)">削除</v-list-item>
        </v-list>
    </v-menu>
</template>
<script lang="ts">
import HTMLTagDataBase, { PositionStyle } from '@/html_tagdata/HTMLTagDataBase';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import HTMLTagStructViewLi_ref from '@/view/HTMLTagStructViewLi.vue'
import { deserialize } from '@/serializable/serializable';
import { generate_tagdata_by_tagname } from './html_tag_view/generate_tagdata_by_tagname';

@Options({
    components: {
        HTMLTagStructViewLi_ref,
    }
})

export default class HTMLTagPropertyView extends Vue {
    @Prop() html_tagdatas_root: Array<HTMLTagDataBase>
    @Prop() tagdata: HTMLTagDataBase

    is_show_contextmenu = false
    x_contextmenu = 0
    y_contextmenu = 0

    get contextmenu_style(): any {
        return {
            display: "inline",
            position: "absolute",
            left: this.x_contextmenu + "px",
            top: this.y_contextmenu + "px",
        }
    }



    dragover(e: DragEvent) {
        if (e.dataTransfer.getData("ppmk/struct_li_id")) {
            e.dataTransfer.dropEffect = "move"
        }
    }
    can_drop(move_tagid: string, target_tagdata: HTMLTagDataBase): boolean {
        if (move_tagid == target_tagdata.tagid) {
            return false
        }

        let is_in_drag_tag = false
        let is_in_target_tag = false
        let j = 0
        let exist_in_target = false
        let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>) { return }
        walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>) {
            for (let i = 0; i < tagdatas.length; i++) {
                if (move_tagid == tagdatas[i].tagid) {
                    is_in_drag_tag = true
                }
                if (is_in_drag_tag) j++
                if (is_in_drag_tag && tagdatas[i].tagid == target_tagdata.tagid) {
                    exist_in_target = true
                }

                walk_tagdatas(tagdatas[i].child_tagdatas)
                if (is_in_drag_tag) j--
                if (is_in_drag_tag && j == 0) {
                    is_in_drag_tag = false
                }
            }
        }
        walk_tagdatas(this.html_tagdatas_root)
        walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>) {
            for (let i = 0; i < tagdatas.length; i++) {
                if (target_tagdata.tagid == tagdatas[i].tagid) {
                    is_in_target_tag = true
                }
                if (is_in_target_tag) j++
                if (is_in_target_tag && tagdatas[i].tagid == move_tagid) {
                    exist_in_target = true
                }

                walk_tagdatas(tagdatas[i].child_tagdatas)
                if (is_in_target_tag) j--
                if (is_in_target_tag && j == 0) {
                    is_in_target_tag = false
                }
            }
        }
        // walk_tagdatas(this.html_tagdatas_root)
        return !exist_in_target
    }

    drop(e: DragEvent, tagdata: HTMLTagDataBase, to_child: boolean) {
        if (e.dataTransfer.getData("ppmk/htmltag")) {
            let json = JSON.stringify(this.html_tagdatas_root)
            let html_tagdatas_root: Array<HTMLTagDataBase> = JSON.parse(json, deserialize)

            let tagname = e.dataTransfer.getData("ppmk/htmltag")
            let tag_data: HTMLTagDataBase = generate_tagdata_by_tagname(tagname)

            let is_child = false
            let child_appended = false
            let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean { return false }
            walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                for (let i = 0; i < tagdatas.length; i++) {
                    if (tagdata.tagid == tagdatas[i].tagid) {
                        if (tagdatas[i].has_child_tag && !e.altKey) {
                            tag_data.position_style = PositionStyle.None
                            tagdata.position_x = undefined
                            tagdata.position_y = undefined
                            if (e.shiftKey) {
                                tagdatas[i].child_tagdatas.unshift(tag_data)
                            } else if (e.ctrlKey) {
                                tagdatas[i].child_tagdatas.push(tag_data)
                            } else {
                                tagdatas[i].child_tagdatas.push(tag_data)
                            }
                            child_appended = true
                            return true
                        }
                    }
                    is_child = true
                    if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                        return true
                    }
                }
                return false
            }
            walk_tagdatas(html_tagdatas_root)

            if (!child_appended) {
                walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                    for (let i = 0; i < tagdatas.length; i++) {
                        if (tagdata.tagid == tagdatas[i].tagid) {
                            if (!is_child) {
                                tag_data.position_style = PositionStyle.Absolute
                            }
                            if (e.shiftKey) {
                                tagdatas.splice(i, 0, tag_data)
                            } else if (e.ctrlKey) {
                                tagdatas.splice(i + 1, 0, tag_data)
                            } else {
                                tagdatas.splice(i + 1, 0, tag_data)
                            }
                            return true
                        }
                        is_child = true
                        if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                            return true
                        }
                    }
                    return false
                }
                walk_tagdatas(html_tagdatas_root)
            }
            this.updated_html_tagdatas(html_tagdatas_root)
        } else if (e.dataTransfer.getData("ppmk/struct_li_id")) {
            if (!this.can_drop(e.dataTransfer.getData("ppmk/struct_li_id"), tagdata)) {
                return
            }
            let html_tagdatas_root: Array<HTMLTagDataBase>
            let move_tagdata: HTMLTagDataBase

            let json = JSON.stringify(this.html_tagdatas_root)
            html_tagdatas_root = JSON.parse(json, deserialize)

            let walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean { return false }
            walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                for (let i = 0; i < tagdatas.length; i++) {
                    if (e.dataTransfer.getData("ppmk/struct_li_id") == tagdatas[i].tagid) {
                        move_tagdata = tagdatas[i]
                        tagdatas.splice(i, 1)
                        return true
                    }
                    if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                        return true
                    }
                }
                return false
            }
            walk_tagdatas(html_tagdatas_root)

            let is_child = false
            let child_appended = false

            if (to_child) {
                walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                    for (let i = 0; i < tagdatas.length; i++) {
                        if (tagdata.tagid == tagdatas[i].tagid) {
                            if (tagdatas[i].has_child_tag && !e.altKey) {
                                move_tagdata.position_style = PositionStyle.None
                                move_tagdata.position_x = undefined
                                move_tagdata.position_y = undefined
                                if (e.shiftKey) {
                                    tagdatas[i].child_tagdatas.splice(i , 0, move_tagdata)
                                } else if (e.ctrlKey) {
                                    tagdatas[i].child_tagdatas.splice(i + 1, 0, move_tagdata)
                                } else {
                                    tagdatas[i].child_tagdatas.splice(i + 1, 0, move_tagdata)
                                }
                                child_appended = true
                                return true
                            }
                        }
                        is_child = true
                        if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                            return true
                        }
                    }
                    return false
                }
                walk_tagdatas(html_tagdatas_root)
            }
            if (!child_appended) {
                walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>): boolean {
                    for (let i = 0; i < tagdatas.length; i++) {
                        if (tagdata.tagid == tagdatas[i].tagid) {
                            if (!is_child) {
                                move_tagdata.position_style = PositionStyle.Absolute
                            }
                            if (e.shiftKey) {
                                tagdatas.splice(i, 0, move_tagdata)
                            } else if (e.ctrlKey) {
                                tagdatas.splice(i + 1, 0, move_tagdata)
                            } else {
                                tagdatas.splice(i + 1, 0, move_tagdata)
                            }
                            return true
                        }
                        is_child = true
                        if (walk_tagdatas(tagdatas[i].child_tagdatas)) {
                            return true
                        }
                    }
                    return false
                }
                walk_tagdatas(html_tagdatas_root)
            }
            this.updated_html_tagdatas(html_tagdatas_root)
        }
    }

    updated_html_tagdatas(html_tagdatas: Array<HTMLTagDataBase>) {
        this.$emit("updated_html_tagdatas", html_tagdatas)
    }

    updated_html_tagdatas_child(tagdatas: any) {
        this.$emit("updated_html_tagdatas", tagdatas)
    }

    dragstart(e: DragEvent, tagdata: HTMLTagDataBase): void {
        e.dataTransfer.setData("ppmk/struct_li_id", tagdata.tagid)
    }

    beforeCreate(): void {
        (this as any).$options.components.HTMLTagStructViewLi = HTMLTagStructViewLi_ref
    }

    onclick_tag(tagdata: HTMLTagDataBase) {
        this.$emit('onclick_tag', tagdata)
    }

    delete_tag(tagdata: HTMLTagDataBase) {
        this.$emit("delete_tagdata", tagdata)
    }

    show_contextmenu(e: MouseEvent) {
        e.preventDefault()
        this.x_contextmenu = e.clientX
        this.y_contextmenu = e.clientY
        this.is_show_contextmenu = true
    }

    copy_tag(tagdata: HTMLTagDataBase) {
        this.$emit("copy_tag", tagdata)
    }
}
</script>
<style scoped>
li {
    margin-left: 20px;
}
</style>
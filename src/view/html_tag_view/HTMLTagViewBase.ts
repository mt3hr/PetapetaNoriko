import HTMLTagDataBase, { PositionStyle } from "@/html_tagdata/HTMLTagDataBase";
import { Vue } from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator"

export default class HTMLTagViewBase extends Vue {
    @Prop({ require: true }) tagdata: HTMLTagDataBase
    @Prop({ require: true }) tagdatas_root: Array<HTMLTagDataBase>
    @Prop() show_border: boolean
    position_css: string
    selected_this_tag = false

    created() {
        this.update_position()
    }

    @Watch('show_border')
    @Watch('tagdata')
    update_position() {
        const style: any = {}
        if (this.tagdata.position_style == PositionStyle.Absolute) {
            style.position = "absolute"
            style.left = this.tagdata.position_x + "px"
            style.top = this.tagdata.position_y + "px"
            style.scale = this.tagdata.scale
        }
        if (this.show_border) {
            style.border = "solid 2px black"
            style["background-color"] = "snow"
        }
        if (this.tagdata.selected_this_tag) {
            style.border = "solid 2px yellow"
        }
        this.position_css = style
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
        walk_tagdatas(this.tagdatas_root)
        walk_tagdatas = function (tagdatas: Array<HTMLTagDataBase>) {
            for (let i = 0; i < tagdatas.length; i++) {
                if (target_tagdata.tagid== tagdatas[i].tagid) {
                    is_in_target_tag= true
                }
                if (is_in_target_tag) j++
                if (is_in_target_tag&& tagdatas[i].tagid == move_tagid) {
                    exist_in_target = true
                }

                walk_tagdatas(tagdatas[i].child_tagdatas)
                if (is_in_target_tag) j--
                if (is_in_target_tag&& j == 0) {
                    is_in_target_tag= false
                }
            }
        }
        // walk_tagdatas(this.tagdatas_root)
        return !exist_in_target
    }
}
import HTMLTagDataBase, { PositionStyle } from "@/html_tagdata/HTMLTagDataBase";
import { Vue } from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator"

export default class HTMLTagViewBase extends Vue {
    @Prop({ require: true }) tagdata: HTMLTagDataBase
    @Prop({ require: true }) tagdatas_root: Array<HTMLTagDataBase>
    @Prop() show_border: boolean
    position_css: string

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
            style.border = "solid 1px black"
            style["background-color"] = "snow"
        }
        this.position_css = style
    }
}
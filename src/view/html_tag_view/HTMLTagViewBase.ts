import HTMLTagDataBase from "@/html_tagdata/HTMLTagDataBase";
import { Vue } from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator"

export default class HTMLTagViewBase extends Vue {
    @Prop({ require: true }) tagdata: HTMLTagDataBase
    position_css: string
    @Watch('tagdata')
    updated_tagdata() {
        this.update_position()
    }
    created() {
        this.update_position()
    }
    update_position() {
        const style: any = {}
        style.position = "absolute"
        style.left = this.tagdata.position_x + "px"
        style.top = this.tagdata.position_y + "px"
        this.position_css = style
    }
}
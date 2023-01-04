<template>
    <H1TagView v-if="tagdata.tagname == 'h1'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :show_border="show_border" @contextmenu.stop="show_contextmenu"
        @onclick_tag="onclick_tag" :tagdatas_root="tagdatas_root" @updated_tagdata="updated_tagdata" />
    <H2TagView v-if="tagdata.tagname == 'h2'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <H3TagView v-if="tagdata.tagname == 'h3'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <H4TagView v-if="tagdata.tagname == 'h4'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <H5TagView v-if="tagdata.tagname == 'h5'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <H6TagView v-if="tagdata.tagname == 'h6'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <PTagView v-if="tagdata.tagname == 'p'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <ATagView v-if="tagdata.tagname == 'a'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <ULTagView v-if="tagdata.tagname == 'ul'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <OLTagView v-if="tagdata.tagname == 'ol'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <LITagView v-if="tagdata.tagname == 'li'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <IMGTagView v-if="tagdata.tagname == 'img'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <TableTagView v-if="tagdata.tagname == 'table'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <TRTagView v-if="tagdata.tagname == 'tr'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <TDTagView v-if="tagdata.tagname == 'td'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <FormTagView v-if="tagdata.tagname == 'form'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <ButtonTagView v-if="tagdata.tagname == 'button'" :tagdata="tagdata" draggable="true" :show_border="show_border"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" @dragstart.stop="on_drag_start"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <CheckBoxTagView v-if="tagdata.tagname == 'checkbox'" :tagdata="tagdata" draggable="true" :show_border="show_border"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" @dragstart.stop="on_drag_start"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <ColorTagView v-if="tagdata.tagname == 'color'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <DateTagView v-if="tagdata.tagname == 'date'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <DateTimeLocalTagView v-if="tagdata.tagname == 'datetimelocal'" :tagdata="tagdata" draggable="true"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @dragstart.stop="on_drag_start" @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag"
        @updated_tagdata="updated_tagdata" />
    <EMailTagView v-if="tagdata.tagname == 'email'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <FileTagView v-if="tagdata.tagname == 'file'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <ImageTagView v-if="tagdata.tagname == 'image'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <MonthTagView v-if="tagdata.tagname == 'month'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <NumberTagView v-if="tagdata.tagname == 'number'" :tagdata="tagdata" draggable="true" :show_border="show_border"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" @dragstart.stop="on_drag_start"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <PasswordTagView v-if="tagdata.tagname == 'password'" :tagdata="tagdata" draggable="true" :show_border="show_border"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" @dragstart.stop="on_drag_start"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <RadioTagView v-if="tagdata.tagname == 'radio'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <RangeTagView v-if="tagdata.tagname == 'range'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <ResetTagView v-if="tagdata.tagname == 'reset'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <SearchTagView v-if="tagdata.tagname == 'search'" :tagdata="tagdata" draggable="true" :show_border="show_border"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" @dragstart.stop="on_drag_start"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <SubmitTagView v-if="tagdata.tagname == 'submit'" :tagdata="tagdata" draggable="true" :show_border="show_border"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" @dragstart.stop="on_drag_start"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <TelTagView v-if="tagdata.tagname == 'tel'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <TextTagView v-if="tagdata.tagname == 'text'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <TimeTagView v-if="tagdata.tagname == 'time'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <URLTagView v-if="tagdata.tagname == 'url'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <WeekTagView v-if="tagdata.tagname == 'week'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <TextAreaTagView v-if="tagdata.tagname == 'textarea'" :tagdata="tagdata" draggable="true" :show_border="show_border"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" @dragstart.stop="on_drag_start"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <SelectTagView v-if="tagdata.tagname == 'select'" :tagdata="tagdata" draggable="true" :show_border="show_border"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" @dragstart.stop="on_drag_start"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <OptionTagView v-if="tagdata.tagname == 'option'" :tagdata="tagdata" draggable="true" :show_border="show_border"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" @dragstart.stop="on_drag_start"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <LabelTagView v-if="tagdata.tagname == 'label'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        :tagdatas_root="tagdatas_root" :show_border="show_border" @contextmenu.stop="show_contextmenu"
        @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <DivTagView v-if="tagdata.tagname == 'div'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />
    <SpanTagView v-if="tagdata.tagname == 'span'" :tagdata="tagdata" draggable="true" @dragstart.stop="on_drag_start"
        @update_tagdatas="update_tagdatas" :tagdatas_root="tagdatas_root" :show_border="show_border"
        @contextmenu.stop="show_contextmenu" @onclick_tag="onclick_tag" @updated_tagdata="updated_tagdata" />

    <v-menu v-model="is_show_contextmenu" :style="contextmenu_style">
        <v-list>
            <v-list-item @click="delete_tag(tagdata)">削除</v-list-item>
        </v-list>
    </v-menu>
</template>
<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Prop } from "vue-property-decorator"
import H1TagView from '@/view/html_tag_view/H1TagView.vue'
import H2TagView from '@/view/html_tag_view/H2TagView.vue'
import H3TagView from '@/view/html_tag_view/H3TagView.vue'
import H4TagView from '@/view/html_tag_view/H4TagView.vue'
import H5TagView from '@/view/html_tag_view/H5TagView.vue'
import H6TagView from '@/view/html_tag_view/H6TagView.vue'
import PTagView from '@/view/html_tag_view/PTagView.vue'
import ATagView from '@/view/html_tag_view/ATagView.vue'
import ULTagView from '@/view/html_tag_view/ULTagView.vue'
import OLTagView from '@/view/html_tag_view/OLTagView.vue'
import LITagView from '@/view/html_tag_view/LITagView.vue'
import IMGTagView from '@/view/html_tag_view/IMGTagView.vue'
import TableTagView from '@/view/html_tag_view/TableTagView.vue'
import TRTagView from '@/view/html_tag_view/TRTagView.vue'
import TDTagView from '@/view/html_tag_view/TDTagView.vue'
import FormTagView from '@/view/html_tag_view/FormTagView.vue'
import ButtonTagView from '@/view/html_tag_view/ButtonTagView.vue'
import CheckBoxTagView from '@/view/html_tag_view/CheckBoxTagView.vue'
import ColorTagView from '@/view/html_tag_view/ColorTagView.vue'
import DateTagView from '@/view/html_tag_view/DateTagView.vue'
import DateTimeLocalTagView from '@/view/html_tag_view/DateTimeLocalTagView.vue'
import EMailTagView from '@/view/html_tag_view/EmailTagView.vue'
import FileTagView from '@/view/html_tag_view/FileTagView.vue'
import ImageTagView from '@/view/html_tag_view/ImageTagView.vue'
import MonthTagView from '@/view/html_tag_view/MonthTagView.vue'
import NumberTagView from '@/view/html_tag_view/NumberTagView.vue'
import PasswordTagView from '@/view/html_tag_view/PasswordTagView.vue'
import RadioTagView from '@/view/html_tag_view/RadioTagView.vue'
import RangeTagView from '@/view/html_tag_view/RangeTagView.vue'
import ResetTagView from '@/view/html_tag_view/ResetTagView.vue'
import SearchTagView from '@/view/html_tag_view/SearchTagView.vue'
import SubmitTagView from '@/view/html_tag_view/SubmitTagView.vue'
import TelTagView from '@/view/html_tag_view/TelTagView.vue'
import TextTagView from '@/view/html_tag_view/TextTagView.vue'
import TimeTagView from '@/view/html_tag_view/TimeTagView.vue'
import URLTagView from '@/view/html_tag_view/URLTagView.vue'
import WeekTagView from '@/view/html_tag_view/WeekTagView.vue'
import TextAreaTagView from '@/view/html_tag_view/TextTagView.vue'
import SelectTagView from '@/view/html_tag_view/SelectTagView.vue'
import OptionTagView from '@/view/html_tag_view/OptionTagView.vue'
import LabelTagView from '@/view/html_tag_view/LabelTagView.vue'
import DivTagView from '@/view/html_tag_view/DivTagView.vue'
import SpanTagView from '@/view/html_tag_view/SpanTagView.vue'
import HTMLTagDataBase from '@/html_tagdata/HTMLTagDataBase';

@Options({
    components: {
        H1TagView,
        H2TagView,
        H3TagView,
        H4TagView,
        H5TagView,
        H6TagView,
        PTagView,
        ATagView,
        ULTagView,
        OLTagView,
        LITagView,
        IMGTagView,
        TableTagView,
        TRTagView,
        TDTagView,
        FormTagView,
        ButtonTagView,
        CheckBoxTagView,
        ColorTagView,
        DateTagView,
        DateTimeLocalTagView,
        EMailTagView,
        FileTagView,
        ImageTagView,
        MonthTagView,
        NumberTagView,
        PasswordTagView,
        RadioTagView,
        RangeTagView,
        ResetTagView,
        SearchTagView,
        SubmitTagView,
        TelTagView,
        TextTagView,
        TimeTagView,
        URLTagView,
        WeekTagView,
        TextAreaTagView,
        SelectTagView,
        OptionTagView,
        LabelTagView,
        DivTagView,
        SpanTagView,
    }
})
export default class HTMLTagView extends Vue {
    @Prop({ require: true }) tagdata: HTMLTagDataBase
    @Prop({ require: true }) tagdatas_root: Array<HTMLTagDataBase>
    @Prop() show_border: boolean
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

    show_contextmenu(e: MouseEvent) {
        e.preventDefault()
        this.x_contextmenu = e.clientX
        this.y_contextmenu = e.clientY
        this.is_show_contextmenu = true
    }

    on_drag_start(e: DragEvent) {
        e.dataTransfer.setData("ppmk/move_tag_id", this.tagdata.tagid)
        e.dataTransfer.setData("ppmk/move_tag_offset_x", e.offsetX.toString())
        e.dataTransfer.setData("ppmk/move_tag_offset_y", e.offsetY.toString())
    }

    onclick_tag(tagdata: HTMLTagDataBase) {
        this.$emit('onclick_tag', tagdata)
    }

    updated_tagdata(tagdata: HTMLTagDataBase) {
        this.$emit("updated_tagdata", tagdata)
    }

    update_tagdatas(tagdatas: Array<HTMLTagDataBase>) {
        this.$emit("update_tagdatas", tagdatas)
    }

    delete_tag(tagdata: HTMLTagDataBase) {
        this.$emit("delete_tagdata", tagdata)
    }
}
</script>
<style scoped>
.tagwrap {
    position: relative;
}
</style>
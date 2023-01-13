<template>
    <div>
        <h2>HTML要素一覧</h2>
        <h3>基本</h3>
        <ul>
            <li v-for="basic_component_name, index in basic_component_names" :key="index" draggable="true"
                :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, basic_component_name)">
                <table>
                    <tr>
                        <td :style="tagname_style"> {{ basic_component_name }} </td>
                    </tr>
                    <tr>
                        <td :style="tagimage_style"><img :alt="basic_component_name"
                                :src="require('@/resource/image/' + basic_component_name + '.png')" /></td>
                    </tr>
                </table>
            </li>
        </ul>
        <h3>見出し</h3>
        <ul>
            <li v-for="headline_component_name, index in headline_component_names" :key="index" draggable="true"
                :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, headline_component_name)">
                <table>
                    <tr>
                        <td :style="tagname_style"> {{ headline_component_name }}</td>
                    </tr>
                    <tr>
                        <td :style="tagimage_style"><img :alt="headline_component_name"
                                :src="require('@/resource/image/' + headline_component_name + '.png')" />
                        </td>
                    </tr>
                </table>
            </li>
        </ul>

        <h3>構造</h3>
        <ul>
            <li v-for="struct_component_name, index in struct_component_names" :key="index" draggable="true"
                :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, struct_component_name)">
                <table>
                    <tr>
                        <td :style="tagname_style"> {{ struct_component_name }}</td>
                    </tr>
                    <tr>
                        <td :style="tagimage_style"><img :alt="struct_component_name"
                                :src="require('@/resource/image/' + struct_component_name + '.png')" />
                        </td>
                    </tr>
                </table>
            </li>
        </ul>
        <h3>フォーム/input</h3>
        <ul>
            <li v-for="form_input_component_name, index in form_imput_component_names" :key="index" draggable="true"
                :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, form_input_component_name)">
                <table>
                    <tr>
                        <td :style="tagname_style"> {{ form_input_component_name }}</td>
                    </tr>
                    <tr>
                        <td :style="tagimage_style"><img :alt="form_input_component_name"
                                :src="require('@/resource/image/' + form_input_component_name + '.png')" />
                        </td>
                    </tr>
                </table>
            </li>
        </ul>
        <h3>その他</h3>
        <ul>
            <li v-for="othor_component_name, index in othor_component_names" :key="index" draggable="true"
                :ondragstart="(e: DragEvent) => ondrag_htmltag_listitem(e, othor_component_name)">
                <table>
                    <tr>
                        <td :style="tagname_style"> {{ othor_component_name }}</td>
                    </tr>
                    <tr>
                        <td :style="tagimage_style"><img :alt="othor_component_name"
                                :src="require('@/resource/image/' + othor_component_name + '.png')" />
                        </td>
                    </tr>
                </table>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

export enum TagListViewMode {
    Text,
    Image,
    TextAndImage,
}

export default class TagListView extends Vue {
    @Prop() mode: TagListViewMode
    tagname_style: any = {}
    tagimage_style: any = {}

    basic_component_names: Array<string> = [
        "p",
        "a",
        "img",
    ]

    headline_component_names: Array<string> = [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
    ]

    struct_component_names: Array<string> = [
        "ul",
        "ol",
        "li",
        "table",
        "th",
        "tr",
        "td",
        "div",
        "span",
    ]

    form_imput_component_names: Array<string> = [
        "form",
        "button",
        "checkbox",
        "color",
        "date",
        "datetimelocal",
        "email",
        "file",
        "image",
        "month",
        "number",
        "password",
        "radio",
        "range",
        "reset",
        "search",
        "submit",
        "tel",
        "text",
        "time",
        "url",
        "week",
    ]

    othor_component_names: Array<string> = [
        "textarea",
        "select",
        "option",
        "label",
    ]

    ondrag_htmltag_listitem(e: DragEvent, tagname: string) {
        e.dataTransfer.setData("ppmk/htmltag", tagname)
    }

    created(): void {
        this.update_style()
    }

    @Watch('mode')
    update_style() {
        if (this.mode == TagListViewMode.Text || this.mode == TagListViewMode.TextAndImage) {
            this.tagname_style = {}
        } else {
            this.tagname_style = {
                display: "none",
            }
        }

        if (this.mode == TagListViewMode.Image || this.mode == TagListViewMode.TextAndImage) {
            this.tagimage_style = {}
        } else {
            this.tagimage_style = {
                display: "none",
            }
        }
    }
}
</script>
<style scoped>
li {
    margin-left: 20px;
}

td {
    min-height: fit-content !important;
}

li table {
    display: table-caption;
}
</style>
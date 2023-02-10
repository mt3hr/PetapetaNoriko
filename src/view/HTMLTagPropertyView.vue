<template>
    <div class="mainside">
        <h2>タグプロパティ</h2>
        <table>
            <tr v-for="property, index in properties" :key="index" :style="generate_style(property)">
                <td>{{ get_property_name_jp(property.name) }}:</td>
                <td>
                    <input class="textbox" :ref="'input_' + property.name" v-if="use_checkbox(property)" type="checkbox"
                        v-model="property.value" :disabled="is_editable_property(property)"
                        @change="(e) => updated_property_value(e, property)" />
                    <textarea class="textbox" v-else-if="use_textarea(property)" :ref="'input_' + property.name"
                        v-model="property.value" :disabled="is_editable_property(property)"
                        @keyup="(e) => updated_property_value(e, property)"></textarea>
                    <select class="textbox" v-else-if="property.type == 'label_type'"
                        @change="(e) => updated_label_type(e, property)">
                        <option :value="LabelType.None">なし</option>
                        <option :value="LabelType.Before">前置</option>
                        <option :value="LabelType.After">後置</option>
                    </select>
                    <input class="textbox" v-else type="text" :ref="'input_' + property.name" v-model="property.value"
                        :disabled="is_editable_property(property)"
                        @keyup="(e) => updated_property_value(e, property)" />
                </td>
            </tr>
        </table>
    </div>
</template>
<script lang="ts">
import HTMLTagDataBase from '@/html_tagdata/HTMLTagDataBase';
import { LabelType } from '@/html_tagdata/LabelType';
import { deserialize } from '@/serializable/serializable';
import { Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

class Property {
    name: string
    value: any
    type: string
}

export default class HTMLTagPropertyView extends Vue {
    LabelType = LabelType
    html_tagdata: HTMLTagDataBase = new HTMLTagDataBase()
    properties: Array<Property> = new Array<Property>()
    @Prop() auto_focus_tag_property_view: boolean

    @Watch("html_tagdata")
    update_properties(new_tagdata: HTMLTagDataBase, old_tagdata: HTMLTagDataBase) {
        this.properties.splice(0)
        if (!new_tagdata) {
            return
        }
        // 型変換しんどいので一度JSONにまるめてしまおう
        let html_tagdata = new_tagdata.clone()

        Object.keys(html_tagdata).forEach((key) => {
            let property: Property = new Property()
            property.name = key
            property.value = html_tagdata[key]
            if (html_tagdata[key] !== undefined) {
                if (typeof (html_tagdata[key]) == "boolean") {
                    property.type = "boolean"
                } else if (key == "label_type") {
                    property.type = "label_type"
                } else {
                    property.type = "string"
                }
            }
            this.properties.push(property)
        })

        if (this.auto_focus_tag_property_view && (!old_tagdata && new_tagdata || new_tagdata.tagid != old_tagdata.tagid) && html_tagdata.focus_property_name) {
            let propertyTemp = new Property()
            propertyTemp.name = new_tagdata.focus_property_name
            this.$nextTick(() => {
                this.$nextTick(() => {
                    if ((this.$refs["input_" + html_tagdata.focus_property_name] as any).focus) {
                        (this.$refs["input_" + html_tagdata.focus_property_name] as any).focus()
                    } else {
                        (this.$refs["input_" + html_tagdata.focus_property_name] as any).forEach(element => {
                            element.focus()
                        });
                    }
                })
            })
        }
    }

    updated_property_value(payload: any, property: Property) {
        let html_tagdata = this.html_tagdata.clone()
        html_tagdata[property.name] = property.value
        this.$emit('updated_html_tag_property', html_tagdata)
    }

    updated_label_type(payload: any, property: Property) {
        let html_tagdata = this.html_tagdata.clone()
        html_tagdata["label_type"] = payload.target.value
        this.$emit('updated_html_tag_property', html_tagdata)
    }

    is_editable_property(property: Property): boolean {
        switch (property.name) {
            case "tagname":
            case "tagid":
                return true
        }
        return false
    }

    generate_style(property: Property): any {
        switch (property.name) {
            case "tagid":
            case "child_tagdatas":
            case "has_child_tag":
            case "selected_this_tag":
            case "position_style":
            case "scale":
            case "focus_property_name":
                return {
                    "display": "none"
                }
        }
        return {}
    }
    get_property_name_jp(name: string) {
        switch (name) {
            case "tagname":
                return "タグ"
            case "tagclass":
                return "クラス"
            case "position_x":
                return "位置(x)"
            case "position_y":
                return "位置(y)"
            case "scale":
                return "大きさ"
            case "text":
                return "テキスト"
        }
        return name
    }

    use_textarea(property: Property): boolean {
        switch (property.name) {
            case "text":
                return true
        }
        return false
    }

    use_checkbox(property: Property): boolean {
        return property.type == "boolean"
    }
}
</script>

<style scoped>
.mainside h2{
    font-family: "Roboto", sans-serif;
    font-size: 30px;
    color: steelblue; 
}
.mainside {
    background:  #e6e6e6;
}

.textbox {
    background: white;
    border-radius: 5px;
    resize: none;
}

.textbox:hover {
    opacity: 0.8;
}

.textbox:focus {
    outline: solid 2px steelblue;
}

textarea {
    resize: none;
    width: 184px;
    height: 200px;
}
</style>
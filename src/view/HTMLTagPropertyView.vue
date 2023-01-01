<template>
    <div>
        <h2>タグプロパティ</h2>
        <table>
            <tr v-for="property, index in properties" :key="index" :style="generate_style(property)">
                <td>{{ get_property_name_jp(property.name) }}:</td>
                <td><input v-if="!use_textarea(property.name)" type="text" :value="property.value"
                        :disabled="is_editable_property(property)"
                        @keyup="(e) => updated_property_value(e, property.name)" />
                    <textarea v-else :value="property.value"
                        :disabled="is_editable_property(property)"
                        @keyup="(e) => updated_property_value(e, property.name)"></textarea>
                </td>
            </tr>
        </table>
    </div>
</template>
<script lang="ts">
import HTMLTagDataBase from '@/html_tagdata/HTMLTagDataBase';
import { deserialize } from '@/serializable/serializable';
import { Vue } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

class Property {
    name: string
    value: string
}

export default class HTMLTagPropertyView extends Vue {
    html_tagdata: HTMLTagDataBase = new HTMLTagDataBase()
    properties: Array<Property> = new Array<Property>()

    @Watch("html_tagdata")
    update_properties() {
        this.properties.splice(0)
        if (!this.html_tagdata) {
            return
        }
        // 型変換しんどいので一度JSONにまるめてしまおう
        let json = JSON.stringify(this.html_tagdata)
        let html_tagdata = JSON.parse(json, deserialize)
        Object.keys(html_tagdata).forEach((key) => {
            let property: Property = new Property()
            property.name = key
            property.value = html_tagdata[key]
            this.properties.push(property)
        })
    }

    updated_property_value(payload: any, property_name: string) {
        let value = payload.target.value

        // cloneだるいから一度JSONにまるめてしまおう
        let json = JSON.stringify(this.html_tagdata)
        let html_tagdata = JSON.parse(json, deserialize)
        html_tagdata[property_name] = value

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
            case "child_tags":
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
                return "位置（x）"
            case "position_y":
                return "位置（y）"
            case "scale":
                return "大きさ"
            case "text":
                return "テキスト"
        }
        return name
    }

    use_textarea(name: string): boolean {
        switch (name) {
            case "text":
                return true
        }
        return false
    }
}
</script>
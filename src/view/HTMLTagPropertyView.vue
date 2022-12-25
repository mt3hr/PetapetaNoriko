<template>
    <div>
        <h2>プロパティ</h2>
        <table>
            <tr v-for="property, index in properties" :key="index">
                <td>{{ property.name }}:</td>
                <td><input type="text" :value="property.value" @change="(e) => updated_property_value(e, property.name)" /> </td>
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
        // 型変換しんどいので一度JSONにまるめてしまおう
        let json = JSON.stringify(this.html_tagdata)
        let html_tagdata = JSON.parse(json, deserialize)
        Object.keys(html_tagdata).forEach((key) => {
            let property: Property = new Property()
            property.name = key
            property.value = html_tagdata[key]
            console.log(property.value)
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
}
</script>
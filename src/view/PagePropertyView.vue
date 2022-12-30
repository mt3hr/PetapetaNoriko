<template>
    <div>
        <h2>ページプロパティ</h2>
        <table>
            <tr v-for="property, index in properties" :key="index">
                <td>{{ property.name }}:</td>
                <td><input type="text" :value="property.value"
                        @change="(e) => updated_property_value(e, property.name)" /> </td>
            </tr>
        </table>
    </div>
</template>
<script lang="ts">
import PageData from '@/page/PageData';
import { deserialize } from '@/serializable/serializable';
import { Vue } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

class Property {
    name: string
    value: string
}

export default class PagePropertyView extends Vue {
    page_data: PageData = new PageData()
    properties: Array<Property> = new Array<Property>()

    @Watch("page_data")
    update_properties() {
        this.properties.splice(0)
        if (!this.page_data) {
            return
        }
        // 型変換しんどいので一度JSONにまるめてしまおう
        let json = JSON.stringify(this.page_data)
        let html_tagdata = JSON.parse(json, deserialize)
        Object.keys(html_tagdata).forEach((key) => {
            switch (key) {
                case "pageid":
                    return
                case "html_tagdatas":
                    return
            }
            let property: Property = new Property()
            property.name = key
            property.value = html_tagdata[key]
            this.properties.push(property)
        })
    }

    updated_property_value(payload: any, property_name: string) {
        let value = payload.target.value

        // cloneだるいから一度JSONにまるめてしまおう
        let json = JSON.stringify(this.page_data)
        let page_data = JSON.parse(json, deserialize)
        page_data[property_name] = value

        this.$emit('updated_page_property', page_data)
    }
}
</script>
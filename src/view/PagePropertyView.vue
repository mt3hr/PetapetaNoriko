<template>
    <div class="mainside">
        <h2>ページプロパティ</h2>
        <table>
            <tr v-for="property, index in properties" :key="index">
                <td>{{ get_property_name_jp(property.name) }}:</td>
                <td><input class="textbox" type="text" :value="property.value"
                        @keyup="(e) => updated_property_value(e, property.name)" /> </td>
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
                case "html_tagdatas":
                case "css":
                case "webfonts":
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

    get_property_name_jp(name: string) {
        switch (name) {
            case "pagename":
                return "ページ名"
            case "width":
                return "幅"
            case "height":
                return "高さ"
        }
        return name
    }
}
</script>
<style>
.mainside h2{
    font-family: "Roboto", sans-serif;
    font-size: 30px;
    color: steelblue;  
}
.textbox{
    background: white;
    border-radius: 5px;
    resize: none;
}
.textbox:hover{
    opacity:0.8;
}
.textbox:focus{
    outline: solid 2px steelblue;
}
</style>
<template>
  <ul :id="component_data.id" :style="style" @drop.stop="on_drop_li_component"
    @dragover.prevent="on_dragover_li_component">
    <PPMKComponentLi v-for="li_data in component_ul_data.children_lis" :key="li_data.id" :component_data="li_data" />
  </ul>
</template>

<script lang="ts">
import PPMKComponentBase from "@/components/PPMKComponentBase"
import PPMKComponentUlData from '@/ppmk/PPMKComponentUlData';
import PPMKComponentLi from '@/components/PPMKComponentLi.vue';
import { Options } from "vue-class-component";
import PPMKComponentLiData from "@/ppmk/PPMKComponentLiData";
import StyleType from "@/ppmk/StyleType";

@Options({
  components: {
    PPMKComponentLi,
  }
})

export default class PPMKComponentUl extends PPMKComponentBase {
  get component_ul_data(): PPMKComponentUlData { return this.component_data as PPMKComponentUlData }

  on_drop_li_component(e: DragEvent) {
    let tagname = e.dataTransfer.getData("ppmk/component")
    if (tagname != "li") {
      return
    }
    let tag_data = new PPMKComponentLiData(null)
    tag_data.styletype = StyleType.NONE
    this.component_ul_data.children_lis.push(tag_data)
    console.log(tag_data)
  }
  on_dragover_li_component(e: DragEvent) {
    let tagname = e.dataTransfer.getData("ppmk/component")
    if (tagname != "li") {
      e.dataTransfer.dropEffect = "none"
      return
    }
    e.dataTransfer.dropEffect = "copy"
  }
}
</script>
<style scoped>
ul {
  min-width: 200px;
  min-height: 50px;
  background-color: silver;
}
</style>
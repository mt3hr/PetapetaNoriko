<template>
  <div>
    <!-- 鬼の条件分岐 -->
    <PPMKComponentLi v-if="component_data.tagname == 'li'" :component_data="component_data"/>
    <PPMKComponentUl v-else-if="component_data.tagname == 'ul'" :component_data="component_data"/>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { Prop } from "vue-property-decorator"
import PPMKComponentData from '@/ppmk/PPMKComponentData';
import PPMKComponentLi from '@/components/PPMKComponentLi.vue'
import PPMKComponentLiData from '@/ppmk/PPMKComponentLiData';
import PPMKComponentUl from './PPMKComponentUl.vue';

@Options({
  components: {
    PPMKComponentUl,
    PPMKComponentLi,
    PPMKComponentLiData,
  }
})

export default class PPMKComponent extends Vue {
  @Prop({ require: true }) component_data: PPMKComponentData
}
</script>

<style scoped>

</style>

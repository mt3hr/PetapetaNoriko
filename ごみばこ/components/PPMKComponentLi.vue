<template>
  <li :id="component_data.id" :style="style">
    {{ component_li_data.text }}
  </li>
</template>

<script lang="ts">
import PPMKComponentBase from "@/components/PPMKComponentBase"
import PPMKComponentLiData from '@/ppmk/PPMKComponentLiData';

export default class PPMKComponentLi extends PPMKComponentBase {
  get component_li_data(): PPMKComponentLiData { return this.component_data as PPMKComponentLiData }
}
</script>
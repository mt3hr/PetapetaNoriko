<template>
    <h5 :style="position_css">{{ text }}</h5>
</template>

<script lang="ts">
import H5TagData from '@/html_tagdata/H5TagData';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class H5TagView extends HTMLTagViewBase {
    get text(): string { return this.tagdata_typed.text }
    get tagdata_typed(): H5TagData { return this.tagdata as H5TagData }
}
</script>
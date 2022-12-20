<template>
    <h6 :style="position_css">{{ text }}</h6>
</template>

<script lang="ts">
import H6TagData from '@/html_tagdata/H6TagData';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class H6TagView extends HTMLTagViewBase {
    get text(): string { return this.tagdata_typed.text }
    get tagdata_typed(): H6TagData { return this.tagdata as H6TagData }
}
</script>
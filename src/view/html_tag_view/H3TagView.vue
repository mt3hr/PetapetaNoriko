<template>
    <h3 :style="position_css">{{ text }}</h3>
</template>

<script lang="ts">
import H3TagData from '@/html_tagdata/H3TagData';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class H3TagView extends HTMLTagViewBase {
    get text(): string { return this.tagdata_typed.text }
    get tagdata_typed(): H3TagData { return this.tagdata as H3TagData }
}
</script>
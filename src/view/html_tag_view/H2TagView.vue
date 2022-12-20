<template>
    <h2 :style="position_css">{{ text }}</h2>
</template>

<script lang="ts">
import H2TagData from '@/html_tagdata/H2TagData';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class H2TagView extends HTMLTagViewBase {
    get text(): string { return this.tagdata_typed.text }
    get tagdata_typed(): H2TagData { return this.tagdata as H2TagData }
}
</script>
<template>
    <h1 :style="position_css">{{ text }}</h1>
</template>

<script lang="ts">
import H1TagData from '@/html_tagdata/H1TagData';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class H1TagView extends HTMLTagViewBase {
    get text(): string { return this.tagdata_typed.text }
    get tagdata_typed(): H1TagData { return this.tagdata as H1TagData }
}
</script>
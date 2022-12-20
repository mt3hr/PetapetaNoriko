<template>
    <h4 :style="position_css">{{ text }}</h4>
</template>

<script lang="ts">
import H4TagData from '@/html_tagdata/H4TagData';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class H4TagView extends HTMLTagViewBase {
    get text(): string { return this.tagdata_typed.text }
    get tagdata_typed(): H4TagData { return this.tagdata as H4TagData }
}
</script>
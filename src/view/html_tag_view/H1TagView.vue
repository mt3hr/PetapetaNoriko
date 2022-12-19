<template>
    <h1 :style="position_css">{{ text }}</h1>
</template>

<script lang="ts">
import HTMLTagViewBase from './HTMLTagViewBase';

export default class H1TagView extends HTMLTagViewBase {
    text = "見出し1"
}
</script>
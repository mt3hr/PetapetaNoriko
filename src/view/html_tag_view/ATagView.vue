<template>
    <a :style="position_css" @click="onclick_tag" :href="href" :name="name" :charset="charset" :hreflang="hreflang"
        :type="type" :rel="rel" :rev="rev" :tabindex="tabindex" :accesskey="accesskey" :shape="shape"
        :coords="coords">{{ text }}</a>
</template>

<script lang="ts">
import ATagData from '@/html_tagdata/ATagData';
import { Watch } from 'vue-property-decorator';
import HTMLTagViewBase from './HTMLTagViewBase';

export default class ATagView extends HTMLTagViewBase {
    text: string
    href: string
    name: string
    charset: string
    hreflang: string
    type: string
    rel: string
    rev: string
    tabindex: string
    accesskey: string
    shape: string
    coords: string

    @Watch('text')
    @Watch('href')
    @Watch('name')
    @Watch('charset')
    @Watch('hreflang')
    @Watch('type')
    @Watch('rel')
    @Watch('rev')
    @Watch('tabindex')
    @Watch('accesskey')
    @Watch('shape')
    @Watch('coords')
    update_tagdata() {
        let tagdata: ATagData = new ATagData()
        tagdata.tagid = this.tagdata.tagid
        tagdata.tagclass = this.tagdata.tagclass
        tagdata.text = this.text
        tagdata.href = this.href
        tagdata.name = this.name
        tagdata.charset = this.charset
        tagdata.hreflang = this.hreflang
        tagdata.type = this.type
        tagdata.rel = this.rel
        tagdata.rev = this.rev
        tagdata.tabindex = this.tabindex
        tagdata.accesskey = this.accesskey
        tagdata.shape = this.shape
        tagdata.coords = this.coords

        this.$emit("updated_tagdata", tagdata)
    }

    get tagdata_typed(): ATagData { return this.tagdata as ATagData }

    @Watch('tagdata')
    update_view() {
        this.text = this.tagdata_typed.text
        this.href = this.tagdata_typed.href
        this.name = this.tagdata_typed.name
        this.charset = this.tagdata_typed.charset
        this.hreflang = this.tagdata_typed.hreflang
        this.type = this.tagdata_typed.type
        this.rel = this.tagdata_typed.rel
        this.rev = this.tagdata_typed.rev
        this.tabindex = this.tagdata_typed.tabindex
        this.accesskey = this.tagdata_typed.accesskey
        this.shape = this.tagdata_typed.shape
        this.coords = this.tagdata_typed.coords
    }

    created(): void {
        this.update_view()
    }

    onclick_tag() {
        this.$emit("onclick_tag", this.tagdata_typed)
    }
}
</script>
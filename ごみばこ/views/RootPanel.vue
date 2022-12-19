<template>
  <div>
    <h1>
      PPMK
    </h1>
    <v-btn :onclick="() => { console.log(generateCSS()); console.log(generateHTMLWithID()) }">print generated html to
      debug console</v-btn>
    <Sidebar />
    <div class="content_panel" @drop.stop="on_drop_component" @dragover.prevent="on_dragover_component">
      <div v-for="component_data, index in component_datas" :key="index">
        <PPMKComponent :component_data="component_data" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import Sidebar from '@/components/SideBar.vue'
import PPMKComponent from '@/components/PPMKComponent.vue'
import PPMKComponentData from '@/ppmk/PPMKComponentData'
import PPMKComponentLiData from '@/ppmk/PPMKComponentLiData'
import PPMKComponentUlData from '@/ppmk/PPMKComponentUlData'

@Options({
  components: {
    Sidebar,
    PPMKComponent,
  }
})

export default class RootPanel extends Vue {
  console = console //TODO けして
  component_datas: Array<PPMKComponentData> = new Array<PPMKComponentData>()
  on_dragover_component(e: DragEvent) {
    e.dataTransfer.dropEffect = "copy"
  }
  on_drop_component(e: DragEvent) {
    let tagname = e.dataTransfer.getData("ppmk/component")
    let tag_data: PPMKComponentData
    // 鬼の条件分岐
    switch (tagname) {
      case "ul":
        tag_data = new PPMKComponentUlData(null)
        break
      case "li":
        tag_data = new PPMKComponentLiData(null)
        break
    }
    tag_data.x = e.x
    tag_data.y = e.y
    this.component_datas.push(tag_data)
  }
  generateHTML(): string {
    let html = ""
    html += "<html>"
    for (let i = 0; i < this.component_datas.length; i++) {
      const component = this.component_datas[i]
      html += "  " + component.generateHTML()
    }
    html += "</html>"
    return html
  }

  generateHTMLWithID(): string {
    let html = ""
    html += "<html>\n"
    for (let i = 0; i < this.component_datas.length; i++) {
      const component = this.component_datas[i]
      html += "  " + component.generateHTMLWithID() + "\n"
    }
    html += "</html>"
    return html
  }

  generateCSS(): string {
    let css = ""
    for (let i = 0; i < this.component_datas.length; i++) {
      const component = this.component_datas[i]
      css += component.generateCSS()
    }
    return css
  }
}
</script>

<style scoped>
.content_panel {
  width: 100vw;
  height: 100vw;
}
</style>

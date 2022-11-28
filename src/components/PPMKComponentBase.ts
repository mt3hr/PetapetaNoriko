import { Vue } from 'vue-class-component'
import { Prop } from "vue-property-decorator"
import PPMKComponentData from '@/ppmk/PPMKComponentData';
import StyleType from '@/ppmk/StyleType';

export default class PPMKComponent extends Vue {
  @Prop() component_data: PPMKComponentData
  style: any = {}

  created() {
    const style: any = {}
    switch (this.component_data.styletype) {
      case StyleType.NONE:
        break
      case StyleType.RELATIVE:
        style.position = "absolute"
        style.left = this.component_data.x + "px"
        style.top = this.component_data.y + "px"
        this.style = style

    }
  }
}
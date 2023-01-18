import { serializable } from "@/serializable/serializable"
import TagListViewMode from "./TagListViewMode"

@serializable
export default class Settings {
    export_base64_image: boolean
    export_head: boolean
    export_position_css: boolean
    show_border: boolean
    transparent_page_css_view: boolean
    auto_save_pagedatas_to_localstorage: boolean
    auto_scroll_tag_struct_view: boolean
    tag_list_view_mode: TagListViewMode
    use_undo: boolean
    auto_focus_tag_property_view: boolean
    session_id: string
}
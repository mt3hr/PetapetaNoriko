import { serializable } from "@/serializable/serializable"
import TagListViewMode from "./TagListViewMode"

@serializable
export default class Settings {
    first_launch = true
    export_base64_image = false
    export_head = true
    export_position_css = false
    show_border = false
    transparent_page_css_view = false
    auto_save_project_data_to_localstorage = true
    auto_focus_tag_property_view = false
    auto_scroll_tag_struct_view = true
    tag_list_view_mode = TagListViewMode.Text
    use_undo = true
    session_id: string
}
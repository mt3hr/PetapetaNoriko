import PageData from "@/page/PageData"
import { serializable } from "@/serializable/serializable"
import generateUUID from "@/uuid"

@serializable
export default class History {
    id = generateUUID()
    page_datas: Array<PageData> = null
    next: History = null
    prev: History = null
}
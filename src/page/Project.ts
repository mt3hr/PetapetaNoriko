import { serializable } from "@/serializable/serializable";
import PageData from "./PageData";

@serializable
export default class Project {
    project_name = ""
    pagedatas = new Array<PageData>()
}
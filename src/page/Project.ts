import { serializable } from "@/serializable/serializable";
import PageData from "./PageData";

@serializable
export class Project {
    project_name = ""
    pagedatas = new Array<PageData>()
}
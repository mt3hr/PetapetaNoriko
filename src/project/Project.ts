import PageData from "@/page/PageData";
import { serializable } from "@/serializable/serializable";
import generateUUID from "@/uuid";

@serializable
export default class Project {
    ppmk_project = new PPMKProject()
    ppmk_project_data = new PPMKProjectData()
    ppmk_project_share = new PPMKProjectShare()

    set project_id(project_id) {
        this.ppmk_project.project_id = project_id
        this.ppmk_project_data.project_id = this.ppmk_project.project_id
        this.ppmk_project_share.project_id = this.ppmk_project.project_id
    }

    constructor() {
        this.project_id = this.ppmk_project.project_id
    }
}

export class PPMKProject {
    project_id = generateUUID()
    owner_user_id: string
    project_name = "プロジェクト"
    is_shared_view: string
}

export class PPMKProjectData {
    project_data_id = generateUUID()
    project_id: string
    saved_time: string
    project_data: Array<PageData>
    author: string
}

export class PPMKProjectShare {
    project_id: string
    user_id: string
    user_name: string
    user_email: string
    writable: boolean
}
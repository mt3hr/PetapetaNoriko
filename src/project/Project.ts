import PageData from "@/page/PageData";
import { serializable } from "@/serializable/serializable";
import generateUUID from "@/uuid";

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

    clone(): PPMKProject {
        let project = new PPMKProject()
        project.project_id = this.project_id
        project.owner_user_id = this.owner_user_id
        project.project_name = this.project_name
        project.is_shared_view = this.is_shared_view
        return project
    }
}

export class PPMKProjectData {
    project_data_id = generateUUID()
    project_id: string
    saved_time: string
    project_data: Array<PageData>
    author: string
    memo: string

    clone(): PPMKProjectData {
        let project_data = new PPMKProjectData()
        project_data.project_data_id = generateUUID()
        project_data.project_id = this.project_id
        project_data.saved_time = this.saved_time

        let pagedatas = Array<PageData>()
        if (this.project_data) {
            this.project_data.forEach(pagedata => {
                pagedatas.push(pagedata.clone())
            });
        }
        project_data.project_data = pagedatas

        project_data.author = this.author
        project_data.memo = this.memo
        return project_data
    }
}

export class PPMKProjectShare {
    project_id: string
    user_id: string
    user_name: string
    user_email: string
    writable: boolean

    clone(): PPMKProjectShare {
        let project_share = new PPMKProjectShare()
        project_share.project_id = this.project_id
        project_share.user_id = this.user_id
        project_share.user_name = this.user_name
        project_share.user_email = this.user_email
        project_share.writable = this.writable
        return project_share
    }
}
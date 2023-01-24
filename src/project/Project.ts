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

    clone(): Project {
        const project = new Project()
        project.ppmk_project = this.ppmk_project.clone()
        project.ppmk_project_data = this.ppmk_project_data.clone()
        project.ppmk_project_share = this.ppmk_project_share.clone()
        return project
    }
}

export class PPMKProject {
    project_id = generateUUID()
    owner_user_id = ""
    project_name = "プロジェクト"
    is_shared_view = false

    clone(): PPMKProject {
        const project = new PPMKProject()
        project.project_id = this.project_id
        project.owner_user_id = this.owner_user_id
        project.project_name = this.project_name
        project.is_shared_view = this.is_shared_view
        return project
    }
}

export class PPMKProjectData {
    project_data_id = generateUUID()
    project_id = ""
    saved_time = ""
    project_data = new Array<PageData>()
    author = ""
    memo = ""

    clone(): PPMKProjectData {
        const project_data = new PPMKProjectData()
        project_data.project_data_id = generateUUID()
        project_data.project_id = this.project_id
        project_data.saved_time = this.saved_time

        if (this.project_data) {
            this.project_data.forEach(pagedata => {
                project_data.project_data.push(pagedata.clone())
            });
        }

        project_data.author = this.author
        project_data.memo = this.memo
        return project_data
    }
}

export class PPMKProjectShare {
    project_id = ""
    user_id = ""
    user_name = ""
    user_email = ""
    writable = false

    clone(): PPMKProjectShare {
        const project_share = new PPMKProjectShare()
        project_share.project_id = this.project_id
        project_share.user_id = this.user_id
        project_share.user_name = this.user_name
        project_share.user_email = this.user_email
        project_share.writable = this.writable
        return project_share
    }
}
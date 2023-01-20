import Project, { PPMKProject, PPMKProjectData, PPMKProjectShare } from "@/project/Project"
import { deserialize } from "@/serializable/serializable"
import md5 from "md5"
import Settings from "../Settings"
import TagListViewMode from "../TagListViewMode"

export const status_address = "/ppmk_server/status"
export const login_address = "/ppmk_server/login"
export const logout_address = "/ppmk_server/logout"
export const reset_password_address = "/ppmk_server/reset_password"
export const register_address = "/ppmk_server/register"
export const list_project_summaries_address = "/ppmk_server/list_project_summaries"
export const get_project_address = "/ppmk_server/get_project_data"
export const save_project_data_address = "/ppmk_server/save_project_data"
export const delete_project_data_address = "/ppmk_server/delete_project_data"
export const update_project_data_address = "/ppmk_server/update_project_data"
export const delete_project_address = "/ppmk_server/delete_project"
export const update_project_address = "/ppmk_server/update_project"
export const addProjectShareAddress = "/ppmk_server/add_project_share"
export const deleteProjectShareAddress = "/ppmk_server/delete_project_share"
export const updateProjectShareAddress = "/ppmk_server/update_project_share"

export class ServerStatus {
    share_view_system: boolean
    enable_reset_password: boolean
}

export class PPMKProjectSummary {
    ppmk_project: PPMKProject
    ppmk_projectDatas: Array<PPMKProjectData>
    ppmk_project_share: PPMKProjectShare
}

export class LoginRequest {
    email: string
    password_hash_md5: string
}

export class LoginResponse {
    session_id: string
    error: string
}

export class LogoutRequest {
    session_id: string
}

export class ResetPasswordRequest {
    email: string
}

export class ResetPasswordResponse {
    error: string
}

export class RegisterRequest {
    username: string
    email: string
    password_hash_md5: string
}

export class RegisterResponse {
    error: string
}

export class ListProjectSummariesRequest {
    session_id: string
}

export class ListProjectSummariesResponse {
    project_summaries: Array<PPMKProjectSummary>
    error: string
}

export class SaveProjectDataRequest {
    session_id: string
    project: Project
}

export class SaveProjectDataResponse {
    error: string
}

export class DeleteProjectDataRequest {
    session_id: string
    project: Project
}

export class DeleteProjectDataResponse {
    error: string
}

export class UpdateProjectDataRequest {
    session_id: string
    project: Project
}

export class UpdateProjectDataResponse {
    error: string
}

export class DeleteProjectRequest {
    session_id: string
    project: Project
}

export class DeleteProjectResponse {
    error: string
}

export class UpdateProjectRequest {
    session_id: string
    project: Project
}

export class UpdateProjectResponse {
    error: string
}

export class GetProjectDataRequest {
    session_id: string
    project_data_id: string
}

export class GetProjectDataResponse {
    error: string
    project_data: PPMKProjectData
}

export class AddProjectShareRequest {
    session_id: string
    project_share: PPMKProjectShare
}

export class AddProjectShareResponse {
    error: string
}

export class DeleteProjectShareRequest {
    session_id: string
    project_share: PPMKProjectShare
}

export class DeleteProjectShareResponse {
    error: string
}

export class UpdateProjectShareRequest {
    session_id: string
    project_share: PPMKProjectShare
}

export class UpdateProjectShareResponse {
    error: string
}

export default class API {
    save_settings_to_cookie(settings: Settings) {
        document.cookie = JSON.stringify(settings)
    }

    load_settings_from_cookie(): Settings {
        let settings = new Settings()
        try {
            settings = JSON.parse(document.cookie, deserialize)
        } catch (e) {
            let settings = new Settings()
            settings.export_base64_image = false
            settings.export_head = true
            settings.export_position_css = false
            settings.show_border = false
            settings.transparent_page_css_view = false
            settings.auto_save_pagedatas_to_localstorage = true
            settings.auto_scroll_tag_struct_view = true
            settings.tag_list_view_mode = TagListViewMode.Text
            settings.use_undo = true
            settings.auto_focus_tag_property_view = true
            // settings.session_id = this.session_id

            this.save_settings_to_cookie(settings)
            settings = JSON.parse(document.cookie, deserialize)
        }
        return settings
    }

    async status(): Promise<ServerStatus> {
        const res = await fetch(status_address)
        const json = await res.json()
        const response: ServerStatus = json
        return response
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        const login_request = new LoginRequest()
        login_request.email = email
        login_request.password_hash_md5 = md5(password)

        const res = await fetch(login_address, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(login_request),
        })
        const json = await res.json()
        const response: LoginResponse = json
        if (response.error) {
            return response
        }
        const settings = this.load_settings_from_cookie()
        settings.session_id = response.session_id
        this.save_settings_to_cookie(settings)
        return response
    }

    logout(): Promise<any> {
        const settings = this.load_settings_from_cookie()
        const session_id = settings.session_id
        settings.session_id = undefined
        this.save_settings_to_cookie(settings)

        const logout_request = new LogoutRequest()
        logout_request.session_id = session_id

        return fetch(logout_address, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(logout_request),
        })
    }

    get session_id(): string {
        return this.load_settings_from_cookie().session_id
    }

    async reset_password(email: string): Promise<ResetPasswordResponse> {
        const reset_password_request = new ResetPasswordRequest()
        reset_password_request.email = email

        const res = await fetch(reset_password_address, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reset_password_request),
        })
        const json = await res.json()
        const response: ResetPasswordResponse = json
        return response
    }

    async register(email: string, password: string, username: string): Promise<RegisterResponse> {
        const register_request = new RegisterRequest()
        register_request.email = email
        register_request.password_hash_md5 = md5(password)
        register_request.username = username

        const res = await fetch(register_address, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(register_request),
        })
        const json = await res.json()
        const response: RegisterResponse = json
        return response
    }

    async list_project_summaries(session_id: string): Promise<ListProjectSummariesResponse> {
        const list_project_summaries_request = new ListProjectSummariesRequest()
        list_project_summaries_request.session_id = session_id

        const res = await fetch(list_project_summaries_address, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(list_project_summaries_request),
        })
        const json = await res.json()
        const response: ListProjectSummariesResponse = json
        return response
    }

    async save_project_data(session_id: string, project: Project): Promise<SaveProjectDataResponse> {
        const save_project_data_request = new SaveProjectDataRequest()
        save_project_data_request.session_id = session_id
        save_project_data_request.project = project

        const res = await fetch(save_project_data_address, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(save_project_data_request),
        })
        const json = await res.json()
        const response: SaveProjectDataResponse = json
        return response
    }

    async delete_project_data(session_id: string, project: Project): Promise<DeleteProjectDataResponse> {
        const delete_project_data_request = new DeleteProjectDataRequest()
        delete_project_data_request.session_id = session_id
        delete_project_data_request.project = project

        const res = await fetch(delete_project_data_address, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(delete_project_data_request),
        })
        const json = await res.json()
        const response: DeleteProjectDataResponse = json
        return response
    }

    async update_project_data(session_id: string, project: Project): Promise<UpdateProjectDataResponse> {
        const update_project_data_request = new UpdateProjectDataRequest()
        update_project_data_request.session_id = session_id
        update_project_data_request.project = project

        const res = await fetch(update_project_data_address, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(update_project_data_request),
        })
        const json = await res.json()
        const response: UpdateProjectDataResponse = json
        return response
    }

    async delete_project(session_id: string, project: Project): Promise<DeleteProjectResponse> {
        const delete_project_request = new DeleteProjectRequest()
        delete_project_request.session_id = session_id
        delete_project_request.project = project

        const res = await fetch(delete_project_address, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(delete_project_request),
        })
        const json = await res.json()
        const response: DeleteProjectResponse = json
        return response
    }

    async update_project(session_id: string, project: Project): Promise<UpdateProjectResponse> {
        const update_project_request = new UpdateProjectRequest()
        update_project_request.session_id = session_id
        update_project_request.project = project

        const res = await fetch(update_project_address, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(update_project_request),
        })
        const json = await res.json()
        const response: UpdateProjectResponse = json
        return response
    }

    async get_project_data(session_id: string, project_data_id: string): Promise<GetProjectDataResponse> {
        const get_project_request = new GetProjectDataRequest()
        get_project_request.session_id = session_id
        get_project_request.project_data_id = project_data_id

        const res = await fetch(get_project_address, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(get_project_request),
        })
        const json = await res.json()
        const response: GetProjectDataResponse = json
        return response
    }

    async add_project_share(session_id: string, project_share: PPMKProjectShare): Promise<AddProjectShareResponse> {
        const add_project_share_request = new AddProjectShareRequest()
        add_project_share_request.session_id = session_id
        add_project_share_request.project_share = project_share

        const res = await fetch(save_project_data_address, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(add_project_share_request),
        })
        const json = await res.json()
        const response: AddProjectShareResponse = json
        return response
    }

    async delete_project_share(session_id: string, project_share: PPMKProjectShare): Promise<DeleteProjectShareResponse> {
        const delete_project_share_request = new DeleteProjectShareRequest()
        delete_project_share_request.session_id = session_id
        delete_project_share_request.project_share = project_share

        const res = await fetch(delete_project_data_address, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(delete_project_share_request),
        })
        const json = await res.json()
        const response: DeleteProjectShareResponse = json
        return response
    }

    async update_project_share(session_id: string, project_share: PPMKProjectShare): Promise<UpdateProjectShareResponse> {
        const update_project_share_request = new UpdateProjectShareRequest()
        update_project_share_request.session_id = session_id
        update_project_share_request.project_share = project_share

        const res = await fetch(update_project_data_address, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(update_project_share_request),
        })
        const json = await res.json()
        const response: UpdateProjectShareResponse = json
        return response
    }
}
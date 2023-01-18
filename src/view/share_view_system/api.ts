import { deserialize } from "@/serializable/serializable"
import md5 from "md5"
import Settings from "../Settings"
import TagListViewMode from "../TagListViewMode"

class LoginRequest {
    email: string
    password_hash_md5: string
}

class LoginResponse {
    session_id: string
    error: string
}

class LogoutRequest {
    session_id: string
}

class ResetPasswordRequest {
    email: string
}

class ResetPasswordResponse {
    error: string
}

export default class API {
    private login_address = "/ppmk_server/login"
    private logout_address = "/ppmk_server/logout"
    private reset_password_address = "/ppmk_server/reset_password"

    async login(email: string, password: string): Promise<any> { //
        const login_request = new LoginRequest()
        login_request.email = email
        login_request.password_hash_md5 = md5(password)

        const res = await fetch(this.login_address, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(login_request),
        })
        const json = await res.json()
        const response: LoginResponse = json
        if (response.error) {
            return response.error
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

        return fetch(this.logout_address, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(logout_request),
        })
    }

    async reset_password(email: string): Promise<any> {
        const reset_password_request = new ResetPasswordRequest()
        reset_password_request.email = email

        const res = await fetch(this.reset_password_address, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reset_password_request),
        })
        const json = await res.json()
        const response: ResetPasswordResponse = json
        if (response.error) {
            return response.error
        }
        return response
    }

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
}
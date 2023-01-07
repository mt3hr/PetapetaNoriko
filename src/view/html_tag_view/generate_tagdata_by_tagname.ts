import ATagData from "@/html_tagdata/ATagData"
import ButtonTagData from "@/html_tagdata/ButtonTagData"
import CheckBoxTagData from "@/html_tagdata/CheckBoxTagData"
import ColorTagData from "@/html_tagdata/ColorTagData"
import DateTagData from "@/html_tagdata/DateTagData"
import DateTimeLocalTagData from "@/html_tagdata/DateTimeLocalTagData"
import DivTagData from "@/html_tagdata/DivTagData"
import EmailTagData from "@/html_tagdata/EmailTagData"
import FileTagData from "@/html_tagdata/FileTagData"
import FormTagData from "@/html_tagdata/FormTagData"
import H1TagData from "@/html_tagdata/H1TagData"
import H2TagData from "@/html_tagdata/H2TagData"
import H3TagData from "@/html_tagdata/H3TagData"
import H4TagData from "@/html_tagdata/H4TagData"
import H5TagData from "@/html_tagdata/H5TagData"
import H6TagData from "@/html_tagdata/H6TagData"
import HTMLTagDataBase from "@/html_tagdata/HTMLTagDataBase"
import ImageTagData from "@/html_tagdata/ImageTagData"
import IMGTagData from "@/html_tagdata/IMGTagData"
import LabelTagData from "@/html_tagdata/LabelTagData"
import LITagData from "@/html_tagdata/LITagData"
import MonthTagData from "@/html_tagdata/MonthTagData"
import NumberTagData from "@/html_tagdata/NumberTagData"
import OLTagData from "@/html_tagdata/OLTagData"
import OptionTagData from "@/html_tagdata/OptionTagData"
import PasswordTagData from "@/html_tagdata/PasswordTagData"
import PTagData from "@/html_tagdata/PTagData"
import RadioTagData from "@/html_tagdata/RadioTagData"
import RangeTagData from "@/html_tagdata/RangeTagData"
import ResetTagData from "@/html_tagdata/ResetTagData"
import SearchTagData from "@/html_tagdata/SearchTagData"
import SelectTagData from "@/html_tagdata/SelectTagData"
import SpanTagData from "@/html_tagdata/SpanTagData"
import SubmitTagData from "@/html_tagdata/SubmitTagData"
import TableTagData from "@/html_tagdata/TableTagData"
import TDTagData from "@/html_tagdata/TDTagData"
import TelTagData from "@/html_tagdata/TelTagData"
import TextAreaTagData from "@/html_tagdata/TextAreaTagData"
import TextTagData from "@/html_tagdata/TextTagData"
import TimeTagData from "@/html_tagdata/TimeTagData"
import TRTagData from "@/html_tagdata/TRTagData"
import ULTagData from "@/html_tagdata/ULTagData"
import URLTagData from "@/html_tagdata/URLTagData"
import WeekTagData from "@/html_tagdata/WeekTagData"

export function generate_tagdata_by_tagname(tagname: string): HTMLTagDataBase {
    let tag_data: HTMLTagDataBase
    // 鬼の条件分岐
    switch (tagname) {
        case "h1":
            tag_data = new H1TagData()
            break
        case "h2":
            tag_data = new H2TagData()
            break
        case "h3":
            tag_data = new H3TagData()
            break
        case "h4":
            tag_data = new H4TagData()
            break
        case "h5":
            tag_data = new H5TagData()
            break
        case "h6":
            tag_data = new H6TagData()
            break
        case "p":
            tag_data = new PTagData()
            break
        case "a":
            tag_data = new ATagData()
            break
        case "ul":
            tag_data = new ULTagData()
            break
        case "ol":
            tag_data = new OLTagData()
            break
        case "li":
            tag_data = new LITagData()
            break
        case "img":
            tag_data = new IMGTagData()
            break
        case "table":
            tag_data = new TableTagData()
            break
        case "tr":
            tag_data = new TRTagData()
            break
        case "td":
            tag_data = new TDTagData()
            break
        case "form":
            tag_data = new FormTagData()
            break
        case "button":
            tag_data = new ButtonTagData()
            break
        case "checkbox":
            tag_data = new CheckBoxTagData()
            break
        case "color":
            tag_data = new ColorTagData()
            break
        case "date":
            tag_data = new DateTagData()
            break
        case "datetimelocal":
            tag_data = new DateTimeLocalTagData()
            break
        case "email":
            tag_data = new EmailTagData()
            break
        case "file":
            tag_data = new FileTagData()
            break
        case "image":
            tag_data = new ImageTagData()
            break
        case "month":
            tag_data = new MonthTagData()
            break
        case "number":
            tag_data = new NumberTagData()
            break
        case "password":
            tag_data = new PasswordTagData()
            break
        case "radio":
            tag_data = new RadioTagData()
            break
        case "range":
            tag_data = new RangeTagData()
            break
        case "reset":
            tag_data = new ResetTagData()
            break
        case "search":
            tag_data = new SearchTagData()
            break
        case "submit":
            tag_data = new SubmitTagData()
            break
        case "tel":
            tag_data = new TelTagData()
            break
        case "text":
            tag_data = new TextTagData()
            break
        case "time":
            tag_data = new TimeTagData()
            break
        case "url":
            tag_data = new URLTagData()
            break
        case "week":
            tag_data = new WeekTagData()
            break
        case "textarea":
            tag_data = new TextAreaTagData()
            break
        case "select":
            tag_data = new SelectTagData()
            break
        case "option":
            tag_data = new OptionTagData()
            break
        case "label":
            tag_data = new LabelTagData()
            break
        case "div":
            tag_data = new DivTagData()
            break
        case "span":
            tag_data = new SpanTagData()
            break
    }
    return tag_data
}
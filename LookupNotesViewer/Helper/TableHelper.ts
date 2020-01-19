import { IInputs } from "../generated/ManifestTypes";
import { download } from "../Libraries/download2.js";
import { AnnotationHelper } from "./AnnotationHelper";
import * as moment from 'moment';

export const annotationHTMLTable = {

    filename: "data-filename",
    annotationid: "data-annotationid",
    mimetype: "data-file-mimetype"


}

export class TableHelper {

    private downloadClicked: EventListenerOrEventListenerObject;
    private textNoteClicked: EventListenerOrEventListenerObject;

    private localContext: ComponentFramework.Context<IInputs>;

    constructor(context: ComponentFramework.Context<IInputs>) {
        this.localContext = context;
    }

    public ShowHideText(evnt: Event): void {
        let btn = evnt.target as HTMLElement;

        if (btn.className === "collapsedText") {
            btn.className = "";
        } else {
            btn.className = "collapsedText";
        }
    }

    public GetTableHtml(elements: ComponentFramework.WebApi.Entity[], 
        emptyMessage = "No notes are available",
        dateTimeFormat = "DD/MM/YYYY HH:MM"): HTMLTableElement {

        if(!dateTimeFormat){
            dateTimeFormat = "DD/MM/YYYY HH:MM";
        }

        let that = this;
        var t = document.createElement("table");
        t.setAttribute("class", "customTable")
        let table: HTMLTableElement = t;



        
        this.textNoteClicked = this.ShowHideText.bind(that);
        this.downloadClicked = this.downloadClick.bind(that);
        if (!!elements && elements.length > 0) {
            elements.forEach(function (annotation: ComponentFramework.WebApi.Entity, index: number) {

                let rowCreatedBy = document.createElement("tr");
                let createdOn = moment(Date.parse(annotation["createdon"])).format(dateTimeFormat);
                rowCreatedBy.appendChild(that.GetCellHtml(`<b>Created by by</b> ${annotation["created.fullname"]} <b>on</b> ${createdOn}`));
                table.appendChild(rowCreatedBy);


                let modifiedon = moment(Date.parse(annotation["modifiedon"])).format(dateTimeFormat);
                let rowModifiedBy = document.createElement("tr");
                rowModifiedBy.appendChild(that.GetCellHtml(`<b>Modified by by</b> ${annotation["modified.fullname"]} <b>on</b> ${modifiedon}`));
                table.appendChild(rowModifiedBy);
                
                

                let rowTitle = document.createElement("tr");
                rowTitle.appendChild(that.GetChildRecord(annotation["subject"] as string));
                table.appendChild(rowTitle);

                let rowNote = document.createElement("tr");
                let divText = document.createElement("div");
                divText.addEventListener('click', that.textNoteClicked);
                divText.setAttribute("class", "collapsedText");
                divText.setAttribute("style","cursor: pointer;");
                divText.textContent = annotation["notetext"] as string;

                let cell = document.createElement("td");
                cell.appendChild(divText);

                rowNote.appendChild(cell);
                rowNote.setAttribute("class", !annotation.isdocument ? "borderBotton" : "");
                table.appendChild(rowNote);

                if (annotation.isdocument) {

                    let rowDocument = document.createElement("tr");
                    let cell = document.createElement("td");
                    cell.setAttribute("style", "vertical-align:middle");
                    cell.setAttribute("class", "borderBotton");

                    let button = document.createElement("p");
                    button.textContent = annotation["filename"] as string;
                    button.setAttribute("style", "cursor: pointer;font-weight:bold;");
                    button.addEventListener("click", that.downloadClicked);
                    button.setAttribute(annotationHTMLTable.filename, annotation["filename"] as string);
                    button.setAttribute(annotationHTMLTable.annotationid, annotation["annotationid"] as string);
                    button.setAttribute(annotationHTMLTable.mimetype, annotation["mimetype"] as string);

                    let icon = document.createElement("i");
                    icon.setAttribute("name", "Show Input Parameter");
                    icon.setAttribute("class", that.GetIconByMimeType(annotation["mimetype"]));

                    button.appendChild(icon);
                    cell.appendChild(button);
                    rowDocument.appendChild(cell);
                    table.appendChild(rowDocument);
                }
            });

            return table;
        } else {
            return this.GetEmptyMessage(emptyMessage);
        }



    }

    public GetEmptyMessage(emptyMessage: string): HTMLTableElement {

        let divMessageEmpty = document.createElement("div");
        divMessageEmpty.innerHTML = `<div class="alert alert-dark">${emptyMessage}</div>`;

        let row = document.createElement("tr");
        let cellMessage = document.createElement("td");

        let tableMessage = document.createElement("table");
        tableMessage.setAttribute("class", "customTable");

        cellMessage.appendChild(divMessageEmpty);
        row.appendChild(cellMessage);
        tableMessage.appendChild(row);

        return tableMessage;
    }

    private GetCellHtml(value: string): HTMLTableDataCellElement {
        let cell = document.createElement("td");
        cell.innerHTML = value;
        return cell;
    }


    private GetChildRecord(value: string): HTMLTableDataCellElement {
        var td = document.createElement("td");
        td.textContent = value;
        return td;
    }

    private GetIconByMimeType(mimetype: string): string {
        switch (mimetype) {
            case 'image': return 'far fa-file-image'; break
            case 'audio': return 'far fa-file-audio'; break
            case 'video': return 'far fa-file-video'; break
            case 'application/pdf': return 'far fa-file-pdf'; break
            case 'application/msword': return 'far fa-file-word'; break
            case 'application/vnd.ms-word': return 'far fa-file-word'; break
            case 'application/vnd.oasis.opendocument.text': return 'far fa-file-word'; break
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml': return 'far fa-file-word'; break
            case 'application/vnd.ms-excel': return 'far fa-file-excel'; break
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml': return 'far fa-file-excel'; break
            case 'application/vnd.oasis.opendocument.spreadsheet': return 'far fa-file-excel'; break
            case 'application/vnd.ms-powerpoint': return 'far fa-file-powerpoint'; break
            case 'application/vnd.openxmlformats-officedocument.presentationml': return 'far ffa-file-powerpoint'; break
            case 'application/vnd.oasis.opendocument.presentation': return 'far fa-file-powerpoint'; break
            case 'text/plain': return 'far fa-file-alt'; break
            case 'text/html': return 'far fa-file-code'; break
            case 'application/json': return 'far fa-file-code'; break
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return 'far fa-file-word'; break
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': return 'far fa-file-excel'; break
            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation': return 'far fa-file-powerpoint'; break
            case 'application/gzip': return 'far fa-file-archive'; break
            case 'application/zip': return 'far fa-file-archive'; break
            case 'application/x-zip-compressed': return 'far fa-file-archive'; break
            case 'application/octet-stream': return 'far fa-file-archive'; break
            case null: "";
            default: return "far fa-file-alt"; break;
        }
    }


    public downloadClick(evnt: Event): void {


        const btn = evnt.target as HTMLElement;

        let fileName = btn.getAttribute(annotationHTMLTable.filename);
        let annotationid = btn.getAttribute(annotationHTMLTable.annotationid);
        annotationid = annotationid == null ? "" : annotationid;

        let mimetype = btn.getAttribute(annotationHTMLTable.mimetype);
        AnnotationHelper.getFile(annotationid, this.localContext).then(function (res: ComponentFramework.WebApi.Entity) {
            if (res != null) {
                let fileBase64 = `data:text/plain;base64,${res["documentbody"]}`;
                download(fileBase64, res["filename"], res["mimetype"]);
            }
        });
    }
}

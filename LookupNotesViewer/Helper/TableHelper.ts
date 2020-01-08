import { IInputs } from "../generated/ManifestTypes";
import { download } from "../Libraries/download2.js";
import { AnnotationHelper } from "./AnnotationHelper";

export const annotationHTMLTable = {

    filename: "data-filename",
    annotationid: "data-annotationid",
    mimetype: "data-file-mimetype"


}

export class TableHelper {
    private downloadClicked: EventListenerOrEventListenerObject;
    private localContext: ComponentFramework.Context<IInputs>;



    constructor(context: ComponentFramework.Context<IInputs>) {
        this.localContext = context;
    }

    public GetHtml(elements: ComponentFramework.WebApi.Entity[]): HTMLTableElement {

        console.log("GetHtml");
        let that = this;
        var t = document.createElement("table");
        t.setAttribute("class", "customTable")
        let table: HTMLTableElement = t;

        //table.className = "table table-striped";
        /*
        let headerRow = document.createElement("tr");
        headerRow.appendChild(this.GetCellText("Created on"));
        headerRow.appendChild(this.GetCellText("Created by"));
        headerRow.appendChild(this.GetCellText("Subject"));
        headerRow.appendChild(this.GetCellText("Text"));
        headerRow.appendChild(this.GetCellText(""));
        table.appendChild(headerRow);
        */

        this.downloadClicked = this.downloadClick.bind(that);




        elements.forEach(function (annotation: ComponentFramework.WebApi.Entity, index: number) {

            let rowMofiedBy = document.createElement("tr");
            rowMofiedBy.appendChild(that.GetCellHtml(`<b>Modified by</b> ${annotation["systemuser1.fullname"]} <b>on</b> ${annotation["createdon"] as string}`));
            table.appendChild(rowMofiedBy);

            let rowTitle = document.createElement("tr");
            rowTitle.appendChild(that.GetChildRecord(annotation["subject"] as string));
            table.appendChild(rowTitle);

            let rowNote = document.createElement("tr");
            rowNote.appendChild(that.GetChildRecord(annotation["notetext"] as string));
            rowNote.setAttribute("class", !annotation.isdocument ? "borderBotton" : "");
            table.appendChild(rowNote);

            if (annotation.isdocument) {

                let rowDocument = document.createElement("tr");
                let cell = document.createElement("td");
                cell.setAttribute("style", "vertical-align:middle");
                cell.setAttribute("class", "borderBotton");
                console.log("creating button");

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

            // OLD TABLE
            /*            
            let row = document.createElement("tr");
            row.appendChild(that.GetChildRecord(annotation["createdon"] as string));
            row.appendChild(that.GetChildRecord(annotation["systemuser1.fullname"] as string));
            row.appendChild(that.GetChildRecord(annotation["subject"] as string));
            row.appendChild(that.GetChildRecord(annotation["notetext"] as string));

            if (annotation.isdocument) {
                let cell = document.createElement("td");
                cell.setAttribute("style","vertical-align:middle");
                console.log("creating button");
                let downloadButton = document.createElement("i");
                downloadButton.setAttribute("type", "button");
                downloadButton.setAttribute("style", "font-size:32px; cursor: pointer;");
                downloadButton.setAttribute("name", "Show Input Parameter");
                downloadButton.setAttribute("class", that.GetIconByMimeType(annotation["mimetype"]));
                downloadButton.setAttribute(annotationHTMLTable.filename, annotation["filename"] as string);
                downloadButton.setAttribute(annotationHTMLTable.annotationid, annotation["annotationid"] as string);
                downloadButton.setAttribute(annotationHTMLTable.mimetype, annotation["mimetype"] as string);
                downloadButton.addEventListener("click", that.downloadClicked);
                cell.appendChild(downloadButton);
                row.appendChild(cell);
            } else {
                row.appendChild(document.createElement("td"));
            }

            table.appendChild(row);
            */
        });

        return table;
    }



    private GetCellText(value: string): HTMLTableDataCellElement {
        let cell = document.createElement("td");
        cell.textContent = value;
        return cell;
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
        console.log("HELLOOO You have clicked the Button !!!! XXX");
        //var tt = require("./Libraries/download2.js");


        const btn = evnt.target as HTMLElement;

        let fileName = btn.getAttribute(annotationHTMLTable.filename);
        let annotationid = btn.getAttribute(annotationHTMLTable.annotationid);
        annotationid = annotationid == null ? "" : annotationid;

        let mimetype = btn.getAttribute(annotationHTMLTable.mimetype);



        AnnotationHelper.getFile(annotationid, this.localContext).then(function (res: ComponentFramework.WebApi.Entity) {
            console.log("I've got the file");
            if (res != null) {
                let fileBase64 = `data:text/plain;base64,${res["documentbody"]}`;

                download(fileBase64, res["filename"], res["mimetype"]);
            }
        })


    }
}






/*
	export function GetHtml(elements: annotationType[]): HTMLTableElement {
		var that = this;
		var t = document.createElement("table");
		t.setAttribute("class", "table table-striped")
		let table: HTMLTableElement = t;
		//table.className = "table table-striped";

		let headerRow = document.createElement("tr");
		headerRow.appendChild(this.GetCellText(""));
		headerRow.appendChild(this.GetCellText("Created by"));
		headerRow.appendChild(this.GetCellText("Created on"));
		headerRow.appendChild(this.GetCellText("Subject"));
		headerRow.appendChild(this.GetCellText("Text"));
		table.appendChild(headerRow);





		elements.forEach(function (annotation: annotationType, index: number) {

			let row = document.createElement("tr");
			let cell = document.createElement("td");


			if (annotation.isdocument) {
				console.log("creating button");
				let downloadButton = document.createElement("i");
				downloadButton.setAttribute("type", "button");
				downloadButton.setAttribute("style", "font-size:32px");
				downloadButton.setAttribute("name", "Show Input Parameter");
				downloadButton.setAttribute("class", that.GetIconByMimeType(annotation.mimetype));
				downloadButton.setAttribute(that.filename, annotation.filename);
				downloadButton.setAttribute(that.annotationid, annotation.annotationid);
				downloadButton.setAttribute(that.mimetype, annotation.mimetype);
				downloadButton.addEventListener("click", that.downloadClick.bind(downloadButton));

				cell.appendChild(downloadButton);

				row.appendChild(cell);
			} else {
				row.appendChild(document.createElement("td"));
			}
			row.appendChild(that.GetChildRecord(annotation.createdby));
			row.appendChild(that.GetChildRecord(annotation.createdon.toDateString()));
			row.appendChild(that.GetChildRecord(annotation.subject));
			row.appendChild(that.GetChildRecord(annotation.notetext));
			table.appendChild(row);

		});

		return table;
    }

    */
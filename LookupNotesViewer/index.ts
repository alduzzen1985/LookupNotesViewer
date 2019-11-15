import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { PrimaryEntity } from "./Helper/EntityHelper";
import { WebApiHelper } from "./Helper/WebApiHelper";

import { AnnotationHelper } from "./Helper/AnnotationHelper";
import { TableHelper, annotationHTMLTable } from "./Helper/TableHelper";



type annotationType = {
	annotationid: string,
	createdon: Date,
	createdby: string,
	subject: string,
	notetext: string,
	isdocument: boolean,
	documentBody: string,
	mimetype: string,
	filename: string
}


export class LookupNotesViewer implements ComponentFramework.StandardControl<IInputs, IOutputs> {



	private localContext: ComponentFramework.Context<IInputs>;
	private localContainer: HTMLDivElement;


	

	/**
	 * Empty constructor.
	 */
	constructor() {

	}


	

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {

	//	this.downloadClicked = this.downloadClick.bind(this);
		this.localContext = context;
		this.localContainer = container;

		console.log("Retrieve the Parameter");

		let crmTagStringsAttribute: string = context.parameters.lookupField.raw as string;
		let currentEntity = new PrimaryEntity(this.localContext);

		var that = this;

		var successRetrieveId = function (val: ComponentFramework.WebApi.Entity) {

			AnnotationHelper.getByRegarding(val["_ag_contact_value"], context).then(function (result: ComponentFramework.WebApi.Entity[]) {
				let tbHelper = new TableHelper(that.localContext);

				
				let table = tbHelper.GetHtml(result);
				let div = document.createElement("div");
				div.appendChild(table);
				that.localContainer.appendChild(div);
			});

		}

		const error = function (val: string) {
			console.log("NUOOOO");
		}



		if (!!currentEntity.Entity.typeName) {
			console.log("I have the Entity");
			let webApiHelper = new WebApiHelper(this.localContext);
			let result = webApiHelper.GetRecordByPrimaryEntityAndSelectFields(currentEntity, successRetrieveId, error, crmTagStringsAttribute);
			console.log("I have the result");
		}

		//https://pcf.gallery/attachment-manager/

	}



	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		// Add code to update control view
		console.log("Something changed");
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
	}





}
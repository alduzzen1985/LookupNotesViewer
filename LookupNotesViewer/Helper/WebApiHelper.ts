import { IInputs, IOutputs } from "../generated/ManifestTypes";
import { PrimaryEntity } from "./EntityHelper";


export class WebApiHelper {

    private context: ComponentFramework.Context<IInputs>;
    constructor(context: ComponentFramework.Context<IInputs>) {
        this.context = context;
    }

    GetRecordByIdEntityAndSelectFields(guid: string, entityType: string, ...selectFields: string[]): any {
        console.log("GetRecordByIdEntityAndSelectFields");
        let stringSelect = "";
        if (selectFields.length > 0) {
            stringSelect = "$select=" + selectFields.join(",");
        }

        return this.context.webAPI.retrieveRecord(entityType, guid, stringSelect);
    }


    GetRecordByPrimaryEntityAndSelectFields(entity: PrimaryEntity, ...selectFields: string[]): any {
        console.log("GetRecordByPrimaryEntityAndSelectFields");
        return this.GetRecordByIdEntityAndSelectFields(entity.Entity.id, entity.Entity.typeName, ...selectFields);
    }


}
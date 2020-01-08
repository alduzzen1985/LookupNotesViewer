import { IInputs } from "../generated/ManifestTypes";
import { FetchXML } from "./EntityHelper";

export const AnnotationHelper = {
  entityname: "annotation",
  fetchXMLAnnotations: `<fetch mapping="logical" version="1.0">
  <entity name="annotation">
    <attribute name="subject" />
    <attribute name="notetext" />
    <attribute name="createdon" />
    <attribute name="mimetype" />
    <attribute name="createdby" />
    <attribute name="annotationid" />
    <attribute name="isdocument" />
    <attribute name="filename" />
    <order attribute="createdon" descending="true" />
    <filter>
      <condition attribute="objectid" operator="eq" value="{objectid}" />
    </filter>
    <link-entity name="systemuser" from="systemuserid" to="createdby" link-type="inner">
      <attribute name="fullname" />
    </link-entity>
  </entity>
</fetch>
    `,

  fetchXMLAnnotationsFile: `<fetch mapping="logical" version="1.0">
    <entity name="annotation">
      <attribute name="documentbody" />
      <attribute name="mimetype" />
      <attribute name="filename" />
      <filter>
        <condition attribute="annotationid" operator="eq" value="{annotationid}" />
      </filter>
    </entity>
  </fetch>
    `,

  getByRegarding: async (objectid: string, context: ComponentFramework.Context<IInputs>) => {
    console.log("GetByRegarding");
    const fetchXml: string = (AnnotationHelper.fetchXMLAnnotations as string).split("{objectid}").join(objectid);
    const documents = await context.webAPI.retrieveMultipleRecords("annotation", FetchXML.prepareOptions(fetchXml));
    console.log("GetRegarding Done");
    return documents.entities;
  },

  getFile: async (annotationid: string, context: ComponentFramework.Context<IInputs>): Promise<ComponentFramework.WebApi.Entity> => {
    console.log("getting file");
    const fetchXml: string = (AnnotationHelper.fetchXMLAnnotationsFile as string).split("{annotationid}").join(annotationid);
    const documents = await context.webAPI.retrieveRecord("annotation", annotationid, "?$select=documentbody,mimetype,filename");
    return documents;
  }
}
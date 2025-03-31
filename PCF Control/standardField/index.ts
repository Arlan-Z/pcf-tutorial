/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */

import { text } from "stream/consumers";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { title } from "process";

export class standardField implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    
    private _inputElement: HTMLInputElement;
    
    /**
     * Empty constructor.
     */
    constructor() {
        // Empty
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        // init
        const button: HTMLButtonElement = document.createElement("button");
        button.innerText = "click me";
        button.addEventListener("click", () => {
            // const urlOptions = {height: 300, width: 400};
            // context.navigation.openUrl("https://www.bing.com", urlOptions); // open a URL
            console.log("Create record");
            context.webAPI.createRecord("arl_contact", {arl_name: "Created from pcf"}).then(

                function (entityId) {
                    console.log("Record created with ID: " + entityId.id);
                },
                function (error) {
                    console.log("Error creating record: " + error.message);
                }
            );
            console.log("Retrieve multiple");
            context.webAPI.retrieveMultipleRecords("arl_contact", "?$select=arl_name").then(
                function (records) {
                    records.entities.forEach((record) => {
                        console.log("Record name: " + record.arl_name);
                    });
                },
                function (error) {
                    console.log("Error retrieving records: " + error.message);
                }
            );
        });
        container.appendChild(button);
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}

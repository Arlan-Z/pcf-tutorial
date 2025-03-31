/* eslint-disable no-var */
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class sampledatasetcontrol implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    
    private _container: HTMLDivElement;
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
        // container.appendChild(document.createTextNode("Hello World!"));
        this._container = container;
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view
        this._container.innerHTML = "";
        var table = document.createElement("table");
        var tr = document.createElement("tr");
        // Table headers
        context.parameters.sampleDataSet.columns.forEach(function (column: DataSetInterfaces.Column) {
            var td = document.createElement("td");
            td.appendChild(document.createTextNode(column.displayName));
            tr.appendChild(td);
            table.appendChild(tr);
            console.log("Column Name: " + column.displayName); 
        });

        context.parameters.sampleDataSet.sortedRecordIds.forEach(function (recordId: string) {
            // const record = context.parameters.sampleDataSet.records[recordId];
            // var email = record.getFormattedValue("Email");
            // console.log("Email: " + email);
            var tr = document.createElement("tr");
            
            context.parameters.sampleDataSet.columns.forEach(function (column: DataSetInterfaces.Column) {
                var td = document.createElement("td");
                td.appendChild(document.createTextNode(context.parameters.sampleDataSet.records[recordId].getFormattedValue(column.name)));
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
        this._container.appendChild(table);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
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

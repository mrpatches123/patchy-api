import { ActionFormData as action, ModalFormData as modal, MessageFormData as message, FormCancelationReason } from '@minecraft/server-ui';
import { ActionData, Form, MessageData, ModalData } from './schema.js';
import { Player } from '../player/class.js';
import { ChestFormData as chest } from '../chest_ui/class.js';
declare class RemovableTree {
    array: any[];
    constructor(array?: never[]);
    next(key: string): this | undefined;
    last(): any;
    beforeLast(lastIndex?: number): any;
}
interface FormPerTypes {
    modal: modal;
    action: action;
    message: message;
    chest: chest;
}
interface GeneratedForm {
    type: keyof FormPerTypes;
    form: FormPerTypes[GeneratedForm['type']];
    formArray: ModalData[] | ActionData[] | MessageData[];
    globalSettings: {
        [key: string]: any;
    };
    callbackArray: (Function | boolean)[];
}
export declare class FormBuilder {
    playerData: {
        [id: string]: {
            awaiting?: {
                [key: string]: boolean;
            };
            formTree?: RemovableTree;
            lastFormsShown?: {
                [formKey: string]: any[];
            };
        };
    };
    forms: {
        [key: string]: Form;
    };
    constructor();
    create(key: string, data: Form): void;
    showConformation(receiver: Player, body?: string, callbackIfYes?: (receiver: Player) => void, callbackIfNo?: (receiver: Player) => void): Promise<FormCancelationReason | undefined>;
    /**
     * @method showConformationAwait
     * @param {Player} receiver
     * @param {String} body
     * @param {(receiver: Player) => {}} callbackIfYes
     * @param {(receiver: Player) => {}} callbackIfNo
     */
    showConformationAwait(receiver: Player, body?: string, callbackIfYes?: (receiver: Player) => void, callbackIfNo?: (receiver: Player) => void): Promise<void>;
    /**
     * @method showAwait
     * @param {Player} receiver
     * @param {String} key
     * @param  {...any} extraArguments
     */
    showAwait(receiver: Player, key: string, ...extraArguments: any[]): void;
    /**
     * @method show
     * @param {Player} receiver
     * @param {String} key
     * @param  {...any} extraArguments
     */
    show(receiver: Player, key: string, ...extraArguments: any[]): void;
    /**
     * @param {Player} receiver
     * @param {String} key
     * @param  {...any} extraArguments
     * @returns {GeneratedForm}
     * @private
     */
    generateForm(receiver: Player, key: string, ...extraArguments: any[]): GeneratedForm;
    /**
     * @param {Player} receiver
     * @param {String} key
     * @param {GeneratedForm} generatedForm return from formBuilder.generateForm
     * @param {Boolean} awaitShow
     * @param  {...any} extraArguments
     * @private
     */
    showForm(receiver: Player, key: string, generatedForm: GeneratedForm, awaitShow: boolean, ...extraArguments: any[]): Promise<void>;
}
export {};

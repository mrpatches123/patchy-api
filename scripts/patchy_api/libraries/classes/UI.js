// import * as UI from "mojang-minecraft-ui";
// import "../../libraries/utilities.js";

// export class Form {
//     constructor() {
//         this.title = "";
//         this.body = "";
//     }
//     title = "";
//     body = "";
//     UIObject = null;
//     showForm(player) {
//         let obj = this.UIObject;
//         this.UIObject ? this.UIObject.show({ player: player, sender: this }).then((params) => { obj.callBack({ params: params, player: player, sender: this }); }) : null;
//     }
// }
// export class Button {
//     constructor(Label = "button", onClick = function () { }) {
//         this.label = Label;
//         this.onClick = onClick;
//     }
// }
// export class IconButton extends Button {
//     constructor(Label = "button", onClick = (player) => { }, iconPath = undefined) {
//         super.label = Label;
//         super.onClick = onClick;
//         this.icon = iconPath;
//     }
//     icon = undefined;
// }
// export class MenuForm extends Form {
//     constructor() {
//         super();
//         super.UIObject = this;
//         this.title = super.title;
//         this.body = super.body;
//         this.onCancel = function () { };
//         this.onExit = function () { };
//         this.oldButtons = [];
//         this.element = {};
//         this.binding = false;
//     }
//     element = {};
//     buttons = [];
//     oldButtons = [];
//     show(eventData) {
//         let MenuForm = new UI.ActionFormData();
//         if (this.binding) {
//             this.bind(this.element, this.element.callBack);
//         }
//         MenuForm.title(this.title ?? "");
//         MenuForm.body(this.body ?? "");
//         this.buttons.forEach((value) => {
//             MenuForm.button(value.label, value.icon);
//         });
//         this.oldButtons = this.buttons;
//         return MenuForm.show(eventData.player);
//     }
//     callBack(eventData) {
//         eventData.sender = this;
//         try {
//             if (eventData.params.isCanceled) {
//                 this.onCancel(eventData);
//                 return;
//             }
//             this.oldButtons[eventData.params.selection].onClick(eventData);
//         } catch (error) {
//             console.warn(error);
//         }
//         this.onExit(eventData);
//     }
//     bind(object_elements, callBackReturnButton) {
//         this.binding = true;
//         object_elements.elements.forEach((value) => { this.buttons.push(callBackReturnButton(value, this)); });
//         this.title = object_elements.title ?? this.title;
//         this.body = object_elements.body ?? this.body;
//         this.element = object_elements;
//         this.element.callBack = callBackReturnButton;
//     }
// }
// export class ConfirmationForm extends Form {
//     constructor() {
//         super();
//         super.UIObject = this;
//         this.title = super.title;
//         this.body = super.body;
//         this.onCancel = function () { };
//         this.onExit = function () { };
//         this.oldButtons = [];
//     }
//     cancelButton = {};
//     confirmButton = {};
//     oldButtons = [];
//     show(eventData) {
//         let Message = new UI.MessageFormData();
//         Message.title(this.title + "");
//         Message.body(this.body + "");
//         Message.button1(this.confirmButton.label);
//         Message.button2(this.cancelButton.label);
//         this.oldButtons = [this.cancelButton, this.confirmButton];
//         return Message.show(eventData.player);
//     }
//     callBack(eventData) {
//         try {
//             eventData.sender = this;
//             this.oldButtons[eventData.params.selection].onClick(eventData);
//             if (eventData.params.selection == 0) {
//                 this.onCancel(eventData);
//             }
//         } catch (error) {
//             console.warn(error);
//         }
//         this.onExit(eventData);
//     }
// }
// export class SettingForm extends Form {
//     constructor() {
//         super();
//         super.UIObject = this;
//         this.title = super.title;
//         this.body = super.body;
//         this.onCancel = function () { };
//         this.onExit = function () { };
//         this.onSubmit = function () { };
//         this.elements = [];
//     }
//     binding = false;
//     elements = [];
//     oldElements = [];
//     show(eventData) {
//         let MenuForm = new UI.ModalFormData();
//         if (this.binding) {
//             this.bind(this.element, this.element.callBack);
//         }
//         MenuForm.title(this.title??"");
//         this.elements.forEach((value)=>{
//             exitSwitch:{
//                 switch(value.type)
//                 {
//                     case "toggle":
//                         MenuForm.toggle(value.label??"",value.value);
//                         break;
//                     case "dropdown":
//                         MenuForm.dropdown(value.label??"",value.values,value.index??(value.value??0));
//                         break;
//                     case "icon":
//                         MenuForm.icon(value.value);
//                     default:
//                         break;
//                 }
//                 this.oldElements.push(value);
//             }
//         });
//         this.oldElements = this.elements;
//         return MenuForm.show(eventData.player);
//     }
//     callBack(eventData) {
//         eventData.sender = this;
//         try {
//             if (eventData.params.isCanceled) {
//                 this.onCancel(eventData);
//                 return;
//             }
//             this.oldButtons[eventData.params.selection].onClick(eventData);
//         } catch (error) {
//             console.warn(error);
//         }
//         this.onExit(eventData);
//     }
//     bind(object_elements, callBackReturnButton) {
//         this.binding = true;
//         object_elements.elements.forEach((value) => { this.buttons.push(callBackReturnButton(value, this)); });
//         this.title = object_elements.title ?? this.title;
//         this.body = object_elements.body ?? this.body;
//         this.element = object_elements;
//         this.element.callBack = callBackReturnButton;
//     }
// }

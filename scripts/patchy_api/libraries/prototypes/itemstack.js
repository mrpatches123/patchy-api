import { ItemStack } from "mojang-minecraft";
const ItemStackFunctions = {
	equalsItemStack(itemStack, ingoreNameTag = true) {
		if (this === itemStack) {
			return true;
		} else if ((this === undefined) || (itemStack === undefined)) {
			return false;
		}
		if (ingoreNameTag) {
			return this.id === itemStack.id && this.data === itemStack.data && this.amount === itemStack.amount;
		} else {
			// content.warn({ this: native.stringify(this), itemStack: native.stringify(itemStack) });
			let nameTagThis = this.nameTag;
			if (nameTagThis) {
				nameTagThis = nameTagThis.replaceAll(lockedItemKey, '');
			}
			let nameTagItemStack = itemStack.nameTag;
			if (nameTagItemStack) {
				nameTagItemStack = nameTagItemStack.replaceAll(lockedItemKey, '');
			}
			return this.id === itemStack.id && this.data === itemStack.data && this.amount === itemStack.amount && nameTagThis === nameTagItemStack;
		}
	}
};
Object.assign(ItemStack.prototype, ItemStackFunctions);
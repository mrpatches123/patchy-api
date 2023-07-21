import { Container } from '@minecraft/server';
const inventoryContainerFunctions = {
	removeItem(ItemStack) {
		for (let i = this.size - 1; i >= 0; i--) {
			const item = this.getItem(i) ?? {};
			// overworld.runCommandAsync(`say 'ItemStack', ${ItemStack.amount}, ${item.amount}`);
			if (item.id === ItemStack.id && item.data === ItemStack.data) {
				const amount = item.amount - ItemStack.amount;
				// overworld.runCommandAsync(`say 'amount', ${amount}`);
				this.setItem(i, Object.assign(ItemStack, { amount: (amount < 0) ? 0 : amount }));
				break;
			}

		}
	},
	transferAllIf(callback, container, ignoreEmpty = true) {
		for (let i = 0; i < this.size; i++) {
			const item = this.getItem(i);
			if (ignoreEmpty && !item) { continue; }
			if (callback(item, i, this, container)) {
				this.setItem(i);
				container.addItem(item);
			}
		}
	},
	openSlotsForItem(id, data, ignoreEmpty = false) {
		id = (!/\w+:/.test(id)) ? `minecraft:${id}` : id;
		let amount = 0;
		for (let i = 0; i < this.size; i++) {
			const item = this.getItem(i);
			if (ignoreEmpty && !item) { continue; }
			if (!item) {
				amount += 64;
			} else if (item.id === id && (item.data === data || !data)) {
				amount += 64 - item.amount;
			}
		}
		return amount;
	},
	numberOf(id, data) {
		id = (!/\w+:/.test(id)) ? `minecraft:${id}` : id;
		content.warn({ text: 'hwwj', id, data });
		let amount = 0;
		for (let i = 0; i < this.size; i++) {
			const item = this.getItem(i);
			if (!item) { continue; }
			content.warn(native.stringify(item));
			if (item.id === id && (item.data === data || !data)) {
				amount += item.amount;
			}
		}
		return amount;
	},
	getArray() {
		return Array.from(Array(this.size), (item, i) => this.getItem(i));
	}
};
Object.assign(Container.prototype, inventoryContainerFunctions);
Object.assign(Container.prototype, inventoryContainerFunctions);
Object.assign(Container.prototype, inventoryContainerFunctions);



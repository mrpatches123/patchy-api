import { MinecraftEnchantmentTypes, EnchantmentList, EnchantmentType } from "mojang-minecraft";
const EnchantmentTypes = Object.values(MinecraftEnchantmentTypes);
const EnchantmentListFunctions = {
	/**
	 * @method getArray - gets an array of enchantments from an EnchantmentList
	 * @returns Array EnchantmentType 
	 */
	getArray() {
		const enchantmentArray = [];
		EnchantmentTypes.forEach(enchantmentType => {
			if (this.hasEnchantment(enchantmentType)) {
				enchantmentArray.push(this.getEnchantment(enchantmentType));
			}
		});
		return enchantmentArray;
	}
};
Object.assign(EnchantmentList.prototype, EnchantmentListFunctions);
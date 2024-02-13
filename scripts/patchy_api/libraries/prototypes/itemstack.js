//@ts-nocheck
import { ContainerSlot } from "@minecraft/server";
const { set } = Object.getOwnPropertyDescriptor(ContainerSlot.prototype, 'amount');
Object.defineProperty(ContainerSlot.prototype, 'amount', {
    set(value) {
        if (value > 0)
            return set.call(this, value);
        this.setItem();
    }
});
//# sourceMappingURL=itemstack.js.map
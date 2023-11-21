import { system } from "@minecraft/server";
import eventBuilder from "../libraries/classes/events/export_instance.js";
class TickEvent {
    constructor() {
        this.lastDate = Date.now();
    }
    get deltaTime() {
        const deltaTime = (Date.now() - this.lastDate) / 1000;
        this.lastDate = Date.now();
        return deltaTime;
    }
    ;
    get curentTick() {
        return system.currentTick;
    }
    ;
}
;
const tickEvent = new TickEvent();
let runId;
eventBuilder.register({
    tick: {
        subscription: {
            custom: {
                function: () => {
                    runId = system.runInterval(() => {
                        eventBuilder.getEvent('tick').iterate(tickEvent);
                    });
                }
            }
        },
        unsubscription: () => {
            system.clearRun(runId);
        }
    },
    beforeChat: {
        subscription: {
            beforeChatSend: {
                function: (event) => {
                    eventBuilder.getEvent('beforeChat').iterate(event);
                }
            }
        }
    },
    chat: {
        subscription: {
            chatSend: {
                function: (event) => {
                    eventBuilder.getEvent('chat').iterate(event);
                }
            }
        }
    },
    blockBreak: {
        subscription: {
            playerBreakBlock: {
                function: (event) => {
                    eventBuilder.getEvent('blockBreak').iterate(event);
                }
            }
        }
    }
});
//# sourceMappingURL=events_zero.js.map
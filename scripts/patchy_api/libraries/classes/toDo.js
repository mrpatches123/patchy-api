import eventBuilder from "./events.js";
class RunObject {
    constructor(callBack, ticks, ...args) {
        this.callBack = callBack;
        this.remainingTicks = ticks;
        this.args = args;
    }
    run() {
        this.callBack(...this.args);
    }
}
class ToDoes {
    constructor() {
        this.todo = [];
    }
    runNext() {
        this.todo = this.todo.filter(value => {
            if (value.remainingTicks > 0) {
                value.remainingTicks--;
                return true;
            } else {
                value.run();
                return false;
            }
        });
    }
    add(callBack, waitTicks, ...params) {
        this.todo.push(new RunObject(callBack, waitTicks, ...params));
    }
}
export class QueueGroup {
    constructor() {
        this.queues = [];
    }
    onTick() {

        if (this.queues.length) {

            this.queues.shift().run();

        }
        return (this.queues.length > 0) ?? false;
    }
    next(callBack, ...params) {
        this.queues.push({ callBack: callBack, params: params, run: function () { callBack(...this.params); } });
    }
}
class ToDo {
    constructor() {
        this.todoes = new ToDoes();
        this.queue = new QueueGroup();
        this.waitFors = [];
        this.queuesGroup = [];
    }
    onTick() {
        this.queue.onTick();
        this.queuesGroup = this.queuesGroup.filter((value) => {
            return value.onTick();
        });
        this.todoes.runNext();


        this.waitFors = this.waitFors.filter((value) => {
            let Success = value.ifIs(...value.params);
            if (Success) {
                value.callBack(...value.params);
            }
            return !Success;

            return false;
        });

    }
    after(callBack, waitInTicks, ...params) {
        this.todoes.add(callBack, waitInTicks, ...params);
    }
    next(callBack, ...params) {
        this.queue.next(callBack, ...params);
    }
    waitFor(callBack, nowFunc, ...params) {
        let ThisWaitFor = { callBack: callBack, ifIs: nowFunc, params: params };
        this.waitFors.push(ThisWaitFor);
    }
    addQueueGroup(queueGroup) {
        if (queueGroup instanceof QueueGroup) {
            this.queuesGroup.push(queueGroup);
        }
        else { console.warn('Not a queueGroup at addQueueGroup()'); }
    }
}
let toDo = new ToDo();
eventBuilder.subscribe('toDo', {
    tick() {
        toDo.onTick();
    }
});
export default toDo;
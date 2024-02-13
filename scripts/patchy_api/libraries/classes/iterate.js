/**
 * @description perpetually iterates through an array one function call at a time
 */
export class Iterate {
    getIterator() {
        const thisIterate = this;
        return (function* () {
            thisIterate.entities = thisIterate.entitiesRefresh();
            for (let i = 0;; i++) {
                const mod = i % thisIterate.entities.length;
                if (mod)
                    thisIterate.entities = thisIterate.entitiesRefresh();
                yield thisIterate.entities[mod];
            }
        })();
    }
    next() {
        return this.iterator.next().value;
    }
    constructor(entitiesRefresh) {
        this.entities = [];
        this.iterator = this.getIterator();
        this.entitiesRefresh = entitiesRefresh;
    }
}
//# sourceMappingURL=iterate.js.map
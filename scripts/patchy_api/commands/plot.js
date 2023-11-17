import { players, commandBuilder, content, plotBuilder, andArray } from "../modules.js";
import config from '../config.js';
const { commandPrefix: prefix } = config;
commandBuilder.register('plot', {
    description: "Used to add and remove plots",
    usages: [
        `${prefix}plot`,
        `${prefix}plot plotKey add playerName`,
        `${prefix}plot plotKey remove playerName`,
        `${prefix}plot plotKey set playerName plotNumber`,
        `${prefix}plot plotKey query playerName`,
        `${prefix}plot plotKey list`,
    ],
    prefix,
    requires: {
        score: {
            staff: 1
        }
    },
    callback: (sender, args) => {
        content.warn({ args });
        let [plotKey, subCommand, playerName, plotNumberToSetString] = args;
        if (!plotKey)
            return sender.sendMessage(JSON.stringify(plotBuilder, (key, value) => (value instanceof Function) ? '<f>' : value, 4));
        if (!plotBuilder.plots.hasOwnProperty(plotKey))
            return sender.sendMessage(`plotKey: ${plotKey}, does not exist`);
        const player = players.get({ name: playerName }).array()[0];
        if (!player)
            return sender.sendMessage(`player: ${playerName}, does not exist`);
        switch (subCommand) {
            case 'add': {
                const { wasAdded, plotNumber, full } = plotBuilder.add(player, plotKey, undefined);
                if (full)
                    return sender.sendMessage(`${plotKey} is full`);
                if (wasAdded)
                    return sender.sendMessage(`${playerName} was added to ${plotKey} at ${plotNumber}`);
                return sender.sendMessage(`${playerName} aready has plot Number: ${plotNumber}`);
            }
            case 'remove': {
                const bool = plotBuilder.remove(player, plotKey);
                if (!bool)
                    return sender.sendMessage(`${playerName} is not on ${plotKey}`);
                return sender.sendMessage(`${playerName} was removed from ${plotKey}`);
            }
            case 'query': {
                return sender.sendMessage(`${playerName} on ${plotKey} has a plotNumber of ${plotBuilder.query(player, plotKey)} and currentPlot: ${player.properties.strings.currentPlot}`);
            }
            case 'set': {
                const plotNumberToSet = Number(plotNumberToSetString);
                if (Number.isNaN(plotNumberToSet))
                    return sender.sendMessage(`plotNumber: ${plotNumberToSet}, is not of type: Number!`);
                const { wasAdded, full, plotNumber } = plotBuilder.add(player, plotKey, plotNumberToSet);
                if (full)
                    return sender.sendMessage(`${plotKey} is full`);
                if (!wasAdded && plotNumber !== plotNumberToSet)
                    return sender.sendMessage(`${playerName} on ${plotKey} already has plot Number ${plotNumber}`);
                if (!wasAdded)
                    return sender.sendMessage(`${playerName} on ${plotKey} could not be set to a plotNumber of ${plotNumber} as it is taken.`);
                return sender.sendMessage(`${playerName} on ${plotKey} now has a plotNumber of ${plotNumber}`);
            }
            case 'list': {
                const { currentIndex, availablePlots } = plotBuilder.list(plotKey);
                return sender.sendMessage(`${plotKey} at currentIndex: ${currentIndex}, has the following available plotNumbers: ${andArray(availablePlots)}`);
            }
            case 'reset': {
                plotBuilder.reset(plotKey);
                return sender.sendMessage(`${plotKey} has been reet and now has the following available plotNumbers: ${andArray(plotBuilder.list(plotKey)['availablePlots'])}`);
            }
        }
    }
});
//# sourceMappingURL=plot.js.map
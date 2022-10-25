import { world, EntityQueryOptions } from '@minecraft/server';
import { overworld } from "../../../patchy_api/libraries/utilities.js";
import databases from '../../../patchy_api/libraries/classes/database.js';
import global from '../../../patchy_api/libraries/classes/global.js';
import eventBuilder from '../../../patchy_api/libraries/classes/events.js';
import { content } from '../../../patchy_api/libraries/utilities.js';

eventBuilder.subscribe('speed', {
  tickAfterLoad: () => {
    global.players.forEach((id, player) => {

      let movement = player.getComponent('minecraft:movement');
      movement.resetToDefaultValue();
      const { current, value } = movement;
      if (current !== value) {
        const name = player.getName();

        const speedFlags = player.scoreAdd('SpeedFlagsS', 1);
        if (nukerFlags > toggles.speedFlagsKick) {
          const kicks = player.scoreAdd('Kicks', 1);
          if (kicks > toggles.kicksBanS) {
            let playerAC = anticheat.get(playerId) ?? { bans: [], kicks: [] };
            playerAC.bans.push({ reason: `§4modifed §fthe §7minecraft:movement Component §fand §7${kicks}>${toggles.kicksBanS} Kicks`, end: 0, start: (new Date()).getTime() });
            // player.runCommand(`say ${JSON.stringify(playerAC)}`);
            try { overworld.runCommand(`tellraw @a[scores={Notifications=1}] {"rawtext":[{"text":"§l§f[§9PAC§f] §7${name} §4failed §1Speed §fby §4modifying§7 the minecraft:movement Component §fand was §1Banned §fdue to §7${kicks}>${toggles.kicksBanS} §1Kicks!"}]}`); } catch { }
            anticheat.set(playerId, playerAC);
            databases.queueSave('anticheat');
          } else {
            global.playerMap[name].kicks.push(`§4modifed §fthe §7minecraft:movement Component§fand §7${nukerFlags}>${toggles.speedFlags} §1Flags!`);
            try { overworld.runCommand(`tellraw @a[scores={Notifications=1}] {"rawtext":[{"text":"§l§f[§9PAC§f] §7${name} §4failed §1Speed §fby §4modifying§7 the minecraft:movement Component §fand was §1Kicked §7${kicks} §ftimes due to §7${speedFlags}>${toggles.speedFlags} §1Flags!"}]}`); } catch { }
          }
        } else {
          let s = (nukerFlags !== 1) ? 's' : '';

          try { overworld.runCommand(`tellraw @a[scores={Notifications=1}] {"rawtext":[{"text":"§l§f[§9PAC§f] §7${name} §4failed §1Speed §fby §4modifying§7 the minecraft:movement Component §fand was §1Flagged §7${speedFlags} §ftime${s}!"}]}`); } catch { }
        }

      }
    });
  }
});

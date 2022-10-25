
import { scoreboardsNames } from '../plugins/initialization/initialize.js';
import { databases, global, content, staff } from '../../../patchy_api/modules.js';
class Discipline {
  constructor() {

  }
  check(player, reason, key, level = 3) {
    content.warn({ reason, key, level });
    const { toggles } = global;
    content.warn({ toggles });
    const actions = [
      () => { },
      () => { },
      () => { this.notify(player, reason); },
      () => {
        const flags = this.flag(player, reason, key, true);
        content.warn({ flags });
        content.warn({ flagsKick: toggles.flagsKick });
        if (flags > toggles.flagsKick[key]) {
          const kicks = player.scoreAdd('kicks', 1);
          if (kicks > toggles.kicksBan) {
            const reasonOther = `§1Banned §fdue to §7${kicks}>${toggles.kicksBan} §1Kicks!`;
            this.notify(player, reason, reasonOther);
            this.ban(player, reason);
          } else {
            const reasonOther = `§1Kicked §7${kicks} §ftimes due to §7${flags}>${toggles.flagsKick[key]} §1Flags!`;
            this.notify(player, reason, reasonOther);
            this.kick(player, reason);
          }
        } else {
          const s = (flags > 0 && flags !== 1) ? 's' : '';
          this.notify(player, reason, `§1Flagged §7${flags} §ftime${s}!`);
        }
      },
      () => {
        this.flag(player, reason, key);
        const kicks = player.scoreAdd('kicks', 1);
        if (kicks > toggles.kicksBan) {
          const reasonOther = `§1Banned §fdue to §7${kicks}>${toggles.kicksBan} §1Kicks!`;
          this.notify(player, reason, reasonOther);
          this.ban(player, reason);
        } else {
          const reasonOther = `§1Kicked §7${kicks} §ftimes due to §7${kicks}>${toggles.flagsKick[key]} §1Flags!`;
          this.notify(player, reason, reasonOther);
          this.kick(player, reason);
        }
      },
      () => { this.ban(player, reason); }
    ];
    actions[level]();
  }
  notify(player, reason, reasonOther) {
    player.tellraw(`§l§f[§9PAC§f] §7You ${reason}${(reasonOther) ? ` and were ${reasonOther}` : '!'}`);
    staff.tellraw(`§l§f[§9PAC§f] §7${player.name} ${reason}${(reasonOther) ? ` and was ${reasonOther}` : '!'}`, player);
  }
  flag(player, reason, key) {
    content.warn({ score: scoreboardsNames[key] });
    return player.scoreAdd(scoreboardsNames[key], 1);
  }
  kick({ name }, reason) {
    content.warn({ name, playerMap: global.playerMap[name] });
    if (!global.playerMap[name].kicks) {
      global.playerMap[name].kicks = [];
    }
    global.playerMap[name].kicks.push(reason);
  }
  ban(player, reason, end = 0) {
    const anticheat = databases.get('anticheat') ?? databases.add('anticheat');
    const { name } = player;
    const { playerId } = global.scoreObject[name];
    let playerAC = anticheat.get(playerId) ?? {};
    if (!playerAC.bans) {
      playerAC.bans = [];
    }
    playerAC.bans.push({ reason: reason, end, start: (new Date()).getTime() });
    anticheat.set(playerId, playerAC);
    databases.queueSave('anticheat');
  }
}
const discipline = new Discipline();
export default discipline;

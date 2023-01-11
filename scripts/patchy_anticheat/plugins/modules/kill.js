import { world, EntityQueryOptions, EntityQueryScoreOptions } from '@minecraft/server';
import { content, overworld } from "../../../patchy_api/libraries/utilities.js";
import databases from '../../../patchy_api/libraries/classes/database.js';
import global from '../../../patchy_api/libraries/classes/global.js';
import eventBuilder from '../../../patchy_api/libraries/classes/events/export_instance.js';
import { bannedItems } from './give/banned_items.js';
eventBuilder.subscribe('kill', {
    playerDeath: ({ player, killer }) => {
        const { scores } = player;
        const { scores: scoresKiller } = killer;
        scores.deaths++;
        scoresKiller.kills++;
        scoresKiller.killStreak++;
    }
});

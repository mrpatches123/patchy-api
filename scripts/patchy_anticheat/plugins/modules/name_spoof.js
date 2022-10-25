export function nameSpoof(player, name) {
    console.warn(player.nameTag)
    if (player.nameTag.includes('"') || player.nameTag.includes('/')) {
        player.nameTag = `Kicked${Math.floor(Math.random()*2000)}`
        Commands.run(`scoreboard player set "${player.nameTag}" SpoofKicked 1`, World.getDimension(dimension));
        Commands.run(`kick "${player.nameTag}" you §4failed §1Name Spoof with the name: ${name} §fand §7were §1Kicked!`, World.getDimension(dimension));
        try { Commands.run(`tellraw @a[scores={Notifications=1}] {"rawtext":[{"text":"§l§f[§9PAC§f] §7${name} §4failed §4failed §1Name Spoof §fand was §1Kicked!"}]}`, World.getDimension(dimension)); } catch { }
        return true
    } else {
        return false
    }
}
// Girl class definition
class Girl {
    constructor(name, health, sus = false, type = "normal") {
        this.name = name;
        this.health = health;
        this.sus = sus;
        this.type = type; // "normal", "zombie", "variant", "reproductive"
    }

    isDefeated() {
        return this.health <= 0;
    }
}

// Dragon class definition
class Dragon {
    constructor(name, health, attackPower) {
        this.name = name;
        this.health = health;
        this.attackPower = attackPower;
    }

    attack(opponent) {
        let damage = Math.floor(Math.random() * this.attackPower) + 10;
        opponent.health -= damage;
        console.log(`
🔥 ${this.name} breathes fire on ${opponent.name}, dealing ${damage} damage!
`);
    }

    isDefeated() {
        return this.health <= 0;
    }
}

// Chahein class definition
class Chahein {
    constructor(name, health, swordPower) {
        this.name = name;
        this.health = health;
        this.swordPower = swordPower;
    }

    attack(opponent) {
        let damage = Math.floor(Math.random() * this.swordPower) + 10;
        opponent.health -= damage;
        console.log(`
🗡️ ${this.name} uses her sword on ${opponent.name}, dealing ${damage} damage!
`);
    }

    summonRandomGirl(minions) {
        const girlTypes = [
            { name: "Girl Minion", type: "normal", sus: false },
            { name: "Girl Zombie", type: "zombie", sus: true },
            { name: "Girl Variant", type: "variant", sus: true },
            { name: "Girl Reproductive", type: "reproductive", sus: true }
        ];
        const pick = girlTypes[Math.floor(Math.random() * girlTypes.length)];
        const newGirl = new Girl(pick.name, 50, pick.sus, pick.type);
        minions.push(newGirl);
        console.log(`😳 ${this.name} summoned a ${pick.name}!`);
    }

    isDefeated() {
        return this.health <= 0;
    }
}

// ...existing code...

function gameLoop(player, opponent, dragon, girl, minions, chahein = null) {
    if (player.isDefeated()) {
        console.log(`${player.name} has been defeated! Game Over.`);
        rl.close();
        return;
    }

    if (dragon && !dragon.isDefeated()) {
        console.log(`The enemy must defeat your dragon first!`);
        dragon.attack(opponent);
        if (!opponent.isDefeated()) {
            opponent.attack(dragon);
        }
    } else if (minions.length > 0) {
        const activeMinion = minions[0];
        console.log(`The enemy must defeat your minion: ${activeMinion.name}`);
        activeMinion.attack(opponent);
        if (!opponent.isDefeated()) {
            opponent.attack(activeMinion);
            if (activeMinion.isDefeated()) {
                console.log(`${activeMinion.name} has been defeated!`);
                minions.shift();
            }
        }
    } else if (chahein && !chahein.isDefeated()) {
        console.log(`The enemy must defeat Chahein!`);
        chahein.attack(opponent);
        if (!opponent.isDefeated()) {
            opponent.attack(chahein);
        }
    } else if (!opponent.isDefeated()) {
        console.log(`The enemy is now attacking you!`);
        opponent.attack(player);
    }

    if (opponent.isDefeated()) {
        console.log(`${opponent.name} has been defeated!`);
        if (!player.hasAsianBelt && player.punchesThrown >= 10) {
            console.log("🎉 You earned the Asian Belt! You can now one-shot opponents!");
            player.hasAsianBelt = true;
        }
        const newOpponent = getRandomOpponent();
        console.log(`${player.name} steps into the Water Map to fight ${newOpponent.name}!`);
        startFight(player, newOpponent, dragon, girl, minions, chahein);
        return;
    }

    displayStatus(player, opponent, dragon, girl, minions, chahein);
    rl.question("Commands: [1] Punch, [2] Block, [3] Use Asian Belt, [d] Summon Dragon, [g] Summon Girl Minion, [r] Rizz Girl, [h] Hug Girl, [b] Backshot Girl, [pokie] Summon Chahein: ", (answer) => {
        if (answer === "1") {
            player.attack(opponent);
        } else if (answer === "2") {
            player.block(opponent);
        } else if (answer === "3") {
            player.useAsianBelt(opponent);
        } else if (answer === "d" && !dragon) {
            console.log(`
🔥🔥🔥 DRAGON SPAWNED! 🔥🔥🔥
A mighty Fire Dragon descends from the skies to assist you!
`);
            dragon = new Dragon("Fire Dragon", 200, 20);
        } else if (answer === "g" && !girl) {
            console.log(`
💖💖💖 GIRL MINION SUMMONED! 💖💖💖
A Girl Minion joins the battle to assist you!
Girl Minion: "I'm here to help!"
`);
            girl = new Girl("Girl Minion", 50);
        } else if (answer === "r" && girl) {
            console.log(`
✨ RIZZ SUCCESSFUL! ✨
You rizzed ${girl.name}, and she summoned a Zombie Minion to assist you!
`);
            const zombie = new ZombieMinion(`Zombie Minion ${minions.length + 1}`, 30, 5);
            minions.push(zombie);
        } else if (answer === "h" && girl) {
            console.log(`
🤗 HUG SUCCESSFUL! 🤗
You hugged ${girl.name}, and she healed you for 10 health!
`);
            player.health += 10;
        } else if (answer === "b" && girl) {
            // Backshot: summon a random girl type
            const girlTypes = [
                { name: "Girl Minion", type: "normal", sus: false },
                { name: "Girl Zombie", type: "zombie", sus: true },
                { name: "Girl Variant", type: "variant", sus: true }
            ];
            const pick = girlTypes[Math.floor(Math.random() * girlTypes.length)];
            const newGirl = new Girl(pick.name, 50, pick.sus, pick.type);
            minions.push(newGirl);
            console.log(`
💥 BACKSHOT! 💥
You backshot ${girl.name}, and she summoned a ${pick.name}!
`);
        } else if (answer === "pokie" && !chahein) {
            console.log(`
🌟 CHAHEIN SUMMONED! 🌟
Chahein joins the battle! She can use her sword and summon random girls!
`);
            chahein = new Chahein("Chahein", 100, 25);
        } else if (answer === "pokie" && chahein) {
            chahein.summonRandomGirl(minions);
        } else {
            console.log("Invalid command! Please enter a valid command.");
        }

        gameLoop(player, opponent, dragon, girl, minions, chahein);
    });
}

// if (minions.length > 0) {
//     console.log("🧟 Minions:");
//     minions.forEach((minion) => {
//         let susText = minion.sus ? " (Sus)" : "";
//         let typeText = minion.type !== "normal" ? ` [${minion.type}]` : "";
//         console.log(`  - ${minion.name}: Health: ${minion.health}${susText}${typeText}`);
//     });
// }
// if (dragon) {
//     console.log(`🔥 ${dragon.name} (Your Dragon)`);
//     console.log(`Health: ${dragon.health}`);
// }
// if (girl) {
//     console.log(`💖 ${girl.name} (Your Ally)`);
//     console.log(`Health: ${girl.health}`);
// }
// if (chahein) {
//     console.log(`🌟 ${chahein.name} (Your Ally)`);
//     console.log(`Health: ${chahein.health}`);
// }
// if (minions.length > 0) {
//     console.log("🧟 Minions:");
//     minions.forEach((minion, index) => {
//         let susText = minion.sus ? " (Sus)" : "";
//         let typeText = minion.type !== "normal" ? ` [${minion.type}]` : "";
//         console.log(`  - ${minion.name}: Health: ${minion.health}${susText}${typeText}`);
//     });
// }
// console.log("------------------------------");
// console.log(`💀 ${opponent.name} (Opponent)`);
// console.log(`Health: ${opponent.health}`);
// console.log("==============================\n");



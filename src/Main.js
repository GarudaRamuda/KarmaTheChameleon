// Code by: James Jek, Nicholas Pastoria, Martin Perina
// Font and art by: James Jek
// Sounds and music by: Nicholas Pastoria
// Fire Auto Sound on Fire by florianreichelt:
// https://freesound.org/people/florianreichelt/sounds/563765/
// Spaghetti Jello Combo Sound by saturdaysoundguy (edited):
// https://freesound.org/people/saturdaysoundguy/sounds/388033/
// Jungle Village by aurelien.leveque:
// https://freesound.org/people/aurelien.leveque/sounds/417635/
// Lake Ducks Squawking at night by Tomlija: https://freesound.org/people/Tomlija/sounds/109490/


// Karma the Chameleon
// Completed 5/3/2022

// Our game implements custom logic for handling the creation of a physics rope to swing the player, as well as many adjustments and tweaks to the player's physics
// based on their state through trigonometric calculations and other techniques.
// In addition, our game uses an object prototyping system to support a system for randomly spawning in terrain for the player, scaling with gameplay stats to adjust difficulty.

// Our game uses a relatively limited color palette with focus brought to the player character and contrast between foreground and background through color and shape language.
// The shape language of the foreground and closest background elements is purposely very limited to give the visuals a sense of cohesion and uniformity.
// We also created a custom particle system in order to import the animation into the game.
// Our sound design includes original music inspired by Donkey Kong Country in order to evoke a jungle vibe while also communicating the emotions of the scenario to the player through
// its composition. We also dynamically scale the volumes of certain elements of the music track to reflect the player's current state in gameplay.


let config = {
    type: Phaser.CANVAS,
    width:1024,
    height:576,
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 1.5
            },
            /*debug: {
                showBody: false,
            }*/
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    pixelArt: true,
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    scene: [Load, Menu, Play, Death],
    callbacks: {
        postBoot: function (game) {
          // In v3.15, you have to override Phaser's default styles
          game.canvas.style.width = '100%';
          game.canvas.style.height = '100%';
        }
    }
};

let game = new Phaser.Game(config);
let pointer, keyA, keyD, keyW, keySPACE;
game.maxHeight = 0;

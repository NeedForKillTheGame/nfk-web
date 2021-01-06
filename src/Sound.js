import Howl from "Howl";
import Utils from "./Utils.js";

var sound_defs = {

	wpkup:	new Howl({ urls: ['sounds/wpkup.wav'] }),
	ammopkup:	new Howl({ urls: ['sounds/ammopkup.wav'] }),
	armor:	new Howl({ urls: ['sounds/armor.wav'] }),
	shard:	new Howl({ urls: ['sounds/shard.wav'] }),
	health5:	new Howl({ urls: ['sounds/health5.wav'] }),
	health25:	new Howl({ urls: ['sounds/health25.wav'] }),
	health50:	new Howl({ urls: ['sounds/health50.wav'] }),
	health100:	new Howl({ urls: ['sounds/health100.wav'] }),

	talk:	new Howl({ urls: ['sounds/talk.wav'] }),


	expl:	new Howl({ urls: ['sounds/expl.wav'] }),
	fire_bfg:	new Howl({ urls: ['sounds/bfg_fire.wav'] }),
	fire_plasma:	new Howl({ urls: ['sounds/plasma.wav'] }),
	fire_gren:	new Howl({ urls: ['sounds/grenade.wav'] }),
	fire_rail:	new Howl({ urls: ['sounds/rail.wav'] }),
	fire_shaft:	new Howl({ urls: ['sounds/lg_hum.wav'] }), // FIXME
	fire_shaft_begin:	new Howl({ urls: ['sounds/lg_start.wav'] }),
	fire_shaft_end:	new Howl({ urls: ['sounds/lg_hum.wav'] }),
	fire_shotgun:	new Howl({ urls: ['sounds/shotgun.wav'] }),
	fire_mach:	new Howl({ urls: ['sounds/machine.wav'] }),
	fire_rocket:	new Howl({ urls: ['sounds/rocket.wav'] }),
	fire_gauntl0:	new Howl({ urls: ['sounds/gauntl_r1.wavv'] }),
	fire_gauntl1:	new Howl({ urls: ['sounds/gauntl_r2.wav'] }),
	fire_gauntl2:	new Howl({ urls: ['sounds/gauntl_a.wav'] }),
	
	
	// take powerup
	powerup_invis:	new Howl({ urls: ['sounds/invisibility.wav'] }),
	powerup_haste:	new Howl({ urls: ['sounds/haste.wav'] }),
	powerup_quad:	new Howl({ urls: ['sounds/quaddamage.wav'] }),
	powerup_regen:	new Howl({ urls: ['sounds/regeneration.wav'] }),
	powerup_battle:	new Howl({ urls: ['sounds/holdable.wav'] }),

	// flag events
	flagtk:	new Howl({ urls: ['sounds/flagtk.wav'] }),
	flagret:	new Howl({ urls: ['sounds/flagret.wav'] }),
	flagcap:	new Howl({ urls: ['sounds/flagcap.wav'] }),

	jumppad:	new Howl({ urls: ['sounds/jumppad.wav'] }),
	respawn:	new Howl({ urls: ['sounds/respawn.wav'] }),
	lava:	new Howl({ urls: ['sounds/lava.wav'] }),
	powerup:	new Howl({ urls: ['sounds/poweruprespawn.wav'] }),
	flight:	new Howl({ urls: ['sounds/flight.wav'] }),
	noammo:	new Howl({ urls: ['sounds/noammo.wav'] }),
	genericdata:	new Howl({ urls: ['sounds/hit.wav'] }),
	gameend:	new Howl({ urls: ['sounds/gameend.wav'] }),
	matchstart:	new Howl({ urls: ['sounds/fight.wav'] }),
	
	model_sound_path: 'sound/models/', // with slash at the end

	models: {
		sarge: getModelSounds('sarge'),
		xaero: getModelSounds('xaero'),
		keel: getModelSounds('keel'),
		doom2: getModelSounds('doom2'),
		crashed: getModelSounds('crashed'),
	}
}
function getModelSounds(model) {
	return {
		jump:    new Howl({ urls: ['sounds/models/' + model + '/jump1.wav'] }),
		death1:  new Howl({ urls: ['sounds/models/' + model + '/death1.wav'] }),
		death2:  new Howl({ urls: ['sounds/models/' + model + '/death2.wav'] }),
		death3:  new Howl({ urls: ['sounds/models/' + model + '/death3.wav'] }),
		pain25:  new Howl({ urls: ['sounds/models/' + model + '/pain25_1.wav'] }),
		pain50:  new Howl({ urls: ['sounds/models/' + model + '/pain50_1.wav'] }),
		pain75:  new Howl({ urls: ['sounds/models/' + model + '/pain75_1.wav'] }),
		pain100: new Howl({ urls: ['sounds/models/' + model + '/pain100_1.wav'] })
	};
}

export default {
	constructor() {
		this.volume = 1;

	},
	
    play(soundId, model) {
		// do not play for inactive window
		if (!document.hasFocus())
			return;
		sound_defs[soundId].volume(this.volume);
		sound_defs[soundId].play();
	},
		
    playModel(model, soundId) {
		// do not play for inactive window
		if (!document.hasFocus())
			return;
		if (!sound_defs.models[model]) {
			model = 'sarge';
		}
		sound_defs.models[model][soundId].volume(this.volume);
		// play only if not playing now
		if (sound_defs.models[model][soundId].pos() == 0)
			sound_defs.models[model][soundId].play();
	},
	
	
	setVolume(value) {
		this.volume = value;
	},


	playJump(player) {
		var soundId = 'jump';
		this.playModel(player.model, soundId);
	},

	playPain(player) {
		var hp = 100;
		if (player.health <= 25) {
			hp = 25;
		} else if (player.health <= 50) {
			hp = 50;
		} else if (player.health <= 75) {
			hp = 75;
		}
		var soundId = 'pain' + hp;
		this.playModel(player.model, soundId);
	},

	playDeath(player) {
		var rnd = (Utils.random(1, 3) + 1);
		var soundId = 'death' + rnd;
		this.playModel(player.model, soundId);
	},

}
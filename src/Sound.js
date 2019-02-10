import Howl from "Howl";

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

	jump:		new Howl({ urls: ['sounds/sarge/jump1.wav'] }),
	death1:		new Howl({ urls: ['sounds/sarge/death1.wav'] }),
	death2:		new Howl({ urls: ['sounds/sarge/death2.wav'] }),
	death3:		new Howl({ urls: ['sounds/sarge/death3.wav'] }),
	
	jumppad:	new Howl({ urls: ['sounds/jumppad.wav'] }),
	respawn:	new Howl({ urls: ['sounds/respawn.wav'] }),
	lava:	new Howl({ urls: ['sounds/lava.wav'] }),
	powerup:	new Howl({ urls: ['sounds/poweruprespawn.wav'] }),
	flight:	new Howl({ urls: ['sounds/flight.wav'] }),
	noammo:	new Howl({ urls: ['sounds/noammo.wav'] }),
	genericdata:	new Howl({ urls: ['sounds/hit.wav'] }),
	gameend:	new Howl({ urls: ['sounds/gameend.wav'] }),
	matchstart:	new Howl({ urls: ['sounds/fight.wav'] }),
	
}

export default {
	constructor() {
		this.volume = 1;
	},
	
    play(soundId) {
		sound_defs[soundId].volume(this.volume);
        sound_defs[soundId].play();
    },
	
	setVolume(value) {
		this.volume = value;
	}
}
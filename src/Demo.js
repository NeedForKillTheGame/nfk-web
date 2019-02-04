import Player from "./Player.js";
import Sound from "./Sound.js";
import Constants from "./Constants.js";
import Utils from "./Utils.js";
import Console from "./Console.js";


export default
class Demo {
	constructor() {

		this.players = [];
		this.data = {};
		
		this.frameId = 0;
	}
	
	loadFromQuery(callback)
	{
		var queryString = window.location.href.slice(window.location.href.indexOf('?') + 1);
        if (queryString.indexOf('demourl=') === 0) {
            var demoUrl = decodeURIComponent(queryString.substring(8)).replace(/\+/g, ' ');
			demoUrl = 'http://nfk.harpywar.com:8080/demo?url=' + demoUrl + '&full=true';
            Console.writeText('demo loaded from url');
			this.load(demoUrl, callback);
        }
	}
	
	load(demoUrl, callback)
	{
		var that = this;
		this._loadJSON(demoUrl,
			function(data) {
				//console.log(data);
				that.data = data;
				that._loadPlayers();
				callback(that);
			},
			function(xhr) { console.error(xhr); }
		);
	}
	
	_loadPlayers()
	{
		for (var i = 0; i < this.data.Players.length; i++)
		{
			var p = new Player(
						this.data.Players[i].PlayerInfo.DXID,
						this.data.Players[i].RealName);
			if (i == 0) {
				p.follow = true; // FIXME: follow only one player (the first)
			}
			this.players.push(p);
			
		}
		console.log("loaded " + this.players.length + " players from demo");
	}
	
	nextFrame(gametic)
	{
		var unit = this.data.DemoUnits[this.frameId++];
		var demounit = unit.DemoUnit;

		//console.log(this.frameId + " / " + unit.DData.gametic  + " / " + gametic );


		switch (unit.DData.type0)
		{
			// update position for a player
			case Constants.DDEMO_PLAYERPOSV3:
				for (var k = 0; k < this.players.length; k++)
				{
					if (demounit.DXID == this.players[k].DXID)
					{
						this.players[k].x = demounit.x;
						this.players[k].y = demounit.y;
						this.players[k].velocityX = demounit.inertiax;
						this.players[k].velocityY = demounit.inertiay;
					}
				}
				break;

			// update player health and armor
			case Constants.DDEMO_HAUPDATE:
				// update position for a player from the frame
				for (var k = 0; k < this.players.length; k++)
				{
					if (demounit.DXID == this.players[k].DXID)
					{
						this.players[k].health = demounit.health;
						this.players[k].armor = demounit.armor;
						// death
						if (demounit.health <= 0)
						{
							Sound.play('death' + (Utils.random(3)+1) );
						}
					}
				}
				break;
				
				
			case Constants.DDEMO_CTF_EVENT_FLAGPICKUP:
			case Constants.DDEMO_CTF_EVENT_FLAGTAKEN:
				Sound.play('flagtk');
				break;
			case Constants.DDEMO_CTF_EVENT_FLAGRETURN:
				Sound.play('flagret');
				break;
			case Constants.DDEMO_CTF_EVENT_FLAGCAPTURE:
				Sound.play('flagcap');
				break;
				
				
			case Constants.DDEMO_EARNPOWERUP:
				// FIXME: need to test taken powerup type
				if (demounit.type1 == 0) Sound.play('powerup_regen');
				if (demounit.type1 == 1) Sound.play('powerup_hold');
				if (demounit.type1 == 2) Sound.play('powerup_haste');
				if (demounit.type1 == 3) Sound.play('powerup_quad');
				if (demounit.type1 == 4) Sound.play('powerup_invis');
				break;
			
			// FIXME: hit player, it is not a death
			case Constants.DDEMO_KILLOBJECT:
				//
				break;
			case Constants.DDEMO_FIREBFG:
				Sound.play('fire_bfg');
				break;
			case Constants.DDEMO_FIREPLASMAV2:
			case Constants.DDEMO_FIREPLASMA:
				Sound.play('fire_plasma');
				break;
			case Constants.DDEMO_FIREGRENV2:
			case Constants.DDEMO_FIREGREN:
				Sound.play('fire_gren');
				break;
			case Constants.DDEMO_FIRERAIL:
				Sound.play('fire_rail');
				break;
			case Constants.DDEMO_FIRESHAFT:
				Sound.play('fire_shaft');
				break;
			case Constants.DDEMO_NEW_SHAFTBEGIN:
				Sound.play('fire_shaft_begin');
				break;
			case Constants.DDEMO_NEW_SHAFTEND:
				Sound.play('fire_shaft_end');
				break;
			case Constants.DDEMO_FIRESHOTGUN:
				Sound.play('fire_shotgun');
				break;
			case Constants.DDEMO_FIREMACH:
				Sound.play('fire_mach');
				break;
			case Constants.DDEMO_FIREROCKET:
				Sound.play('fire_rocket');
				break;
				
			case Constants.DDEMO_JUMPSOUND:
				Sound.play('jump');
				break;
			case Constants.DDEMO_JUMPPADSOUND:
				Sound.play('jumppad');
				break;
			case Constants.DDEMO_RESPAWNSOUND:
				Sound.play('respawn');
				break;
			case Constants.DDEMO_LAVASOUND:
				Sound.play('lava');
				break;
			case Constants.DDEMO_POWERUPSOUND:
				Sound.play('powerup');
				break;
			case Constants.DDEMO_FLIGHTSOUND:
				Sound.play('flight');
				break;
			case Constants.DDEMO_NOAMMOSOUND:
				Sound.play('noammo');
				break;
			case Constants.DDEMO_GENERICSOUNDDATA:
				//Sound.play('genericdata'); // FIXEME: hit player?
				break;
			case Constants.DDEMO_GENERICSOUNDSTATDATA:
				Sound.play('genericstatdata'); // FIXME: end of the game?
				break;
				
				
		}
		
	}
	
	
	_loadJSON(path, success, error)
	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					if (success)
						success(JSON.parse(xhr.responseText));
				} else {
					if (error)
						error(xhr);
				}
			}
		};
		xhr.open("GET", path, true);
		xhr.send();
	}
}
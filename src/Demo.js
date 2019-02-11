import Player from "./Player.js";
import Sound from "./Sound.js";
import Constants from "./Constants.js";
import Utils from "./Utils.js";
import Console from "./Console.js";
import Global from "./G.js";

export default
class Demo {
	constructor(g) {
		this.g = g;
		this.players = g.players;
		this.data = {};
		
		this.frameId = 0;
	}
	
	loadFromQuery(callback)
	{
		var queryString = window.location.href.slice(window.location.href.indexOf('?') + 1);
        if (queryString.indexOf('demourl=') === 0) {
            var demoUrl = decodeURIComponent(queryString.substring(8)).replace(/\+/g, ' ');
			demoUrl = this.g.config.demoServiceUrl + demoUrl + '&full=true';
            Console.writeText('loading demo from url ' + demoUrl);
			this.load(demoUrl, callback);
        }
	}
	
	load(demoUrl, callback)
	{
		var that = this;
		this._loadJSON(demoUrl,
			function(data) {
				Utils.removeHtmlElement("loading");
				//console.log(data);
				that.data = data;
				callback(that);
			},
			function(xhr) { 
				Utils.removeHtmlElement("loading");
				Console.writeText('error loading demo');
				console.error(xhr);
			}
		);
	}
	
	spawnPlayer(dxid, name)
	{
		var p = new Player(this.g, dxid, name);
		if (this.players.length == 0) {
			p.follow = true; // FIXME: follow only one player (the first)
		}
		this.players.push(p);
		return p;
	}
	
	nextFrame(gametic)
	{
		// end of the demo
		if (this.frameId > this.data.DemoUnits.length - 1) {
			// TODO: display players summary statistics
			Sound.play('gameend');
			console.log("end of demo");
			return false;
		}
		
		
		var unit = this.data.DemoUnits[this.frameId];
		var demounit = unit.DemoUnit;


		//console.log(this.frameId + " / " + unit.DData.gametime + " / " + unit.DData.gametic  + " / " + gametic );
		if (gametic != unit.DData.gametic)
			return true;

		//console.log("next");
		
		this.frameId++;
		


		switch (unit.DData.type0)
		{
			// match start
			case Constants.DDEMO_TIMESET:
				// if warmup then do nothing
				if (demounit.warmup == 0) {
					Sound.play('matchstart');
					this.g.map.spawnObjects();
				}
				
				break;
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
						
						if ((demounit.PUV3 & Constants.PUV3_DIR0)==Constants.PUV3_DIR0) this.players[k].dir = Constants.DIR_LW;
						if ((demounit.PUV3 & Constants.PUV3_DIR1)==Constants.PUV3_DIR1) this.players[k].dir = Constants.DIR_RW;
						if ((demounit.PUV3 & Constants.PUV3_DIR2)==Constants.PUV3_DIR2) this.players[k].dir = Constants.DIR_LS;
						if ((demounit.PUV3 & Constants.PUV3_DIR3)==Constants.PUV3_DIR3) this.players[k].dir = Constants.DIR_RS;
						if ((demounit.PUV3 & Constants.PUV3_DEAD0)==Constants.PUV3_DEAD0) this.players[k].dead = 0;
						if ((demounit.PUV3 & Constants.PUV3_DEAD1)==Constants.PUV3_DEAD1) this.players[k].dead = 1;
						if ((demounit.PUV3 & Constants.PUV3_DEAD2)==Constants.PUV3_DEAD2) this.players[k].dead = 2;
						if ((demounit.PUV3 & Constants.PUV3_WPN0)==Constants.PUV3_WPN0) this.players[k].weapon = 0;
						if ((demounit.PUV3 & Constants.PUV3_WPN1)==Constants.PUV3_WPN1) this.players[k].weapon = 1;
						if ((demounit.PUV3 & Constants.PUV3_WPN2)==Constants.PUV3_WPN2) this.players[k].weapon = 2;
						if ((demounit.PUV3 & Constants.PUV3_WPN3)==Constants.PUV3_WPN3) this.players[k].weapon = 3;
						if ((demounit.PUV3 & Constants.PUV3_WPN4)==Constants.PUV3_WPN4) this.players[k].weapon = 4;
						if ((demounit.PUV3 & Constants.PUV3_WPN5)==Constants.PUV3_WPN5) this.players[k].weapon = 5;
						if ((demounit.PUV3 & Constants.PUV3_WPN6)==Constants.PUV3_WPN6) this.players[k].weapon = 6;
						if ((demounit.PUV3 & Constants.PUV3_WPN7)==Constants.PUV3_WPN7) this.players[k].weapon = 7;
						if ((demounit.PUV3B & Constants.PUV3B_WPN8)==Constants.PUV3B_WPN8) this.players[k].weapon = 8;
						this.players[k].crouch = ((demounit.PUV3B & Constants.PUV3B_CROUCH)==Constants.PUV3B_CROUCH) ? true : false;
						this.players[k].BALLOON = ((demounit.PUV3B & Constants.PUV3B_BALLOON)==Constants.PUV3B_BALLOON) ? true : false;
						
						if ((this.players[k].dead == 0) && ((demounit.PUV3 & Constants.PUV3_DEAD1)==Constants.PUV3_DEAD1))
							this.players[k].graphics.stop();
						else
							this.players[k].graphics.play();
						
						if ((this.players[k].dead > 0) && ((demounit.PUV3 & Constants.PUV3_DEAD0)==Constants.PUV3_DEAD0) && (this.players[k].rewardtime>0)) this.players[k].rewardtime = 0;
						this.players[k].fangle = demounit.wpnang;

						// fixangle
						if ((this.players[k].dir==1) || (this.players[k].dir==3))
							if (this.players[k].fangle > 0x7F) this.players[k].fangle = 0xFF - this.players[k].fangle; 
						else
							if (this.players[k].fangle <= 0x7F) this.players[k].fangle = 0xFF - this.players[k].fangle;

						this.players[k].ammo_mg = demounit.currammo;
						this.players[k].ammo_sg = demounit.currammo;
						this.players[k].ammo_gl = demounit.currammo;
						this.players[k].ammo_rl = demounit.currammo;
						this.players[k].ammo_sh = demounit.currammo;
						this.players[k].ammo_rg = demounit.currammo;
						this.players[k].ammo_pl = demounit.currammo;
						this.players[k].ammo_bfg = demounit.currammo;
						
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
						if ( this.players[k].dead )
						{
							Sound.play('death' + (Utils.random(3)+1) );
						}
					}
				}
				break;
			
			// player joined
			case Constants.DDEMO_CREATEPLAYERV2:
				var name = demounit.netname;
				var p = this.spawnPlayer(demounit.DXID, name);
				p.changeTeam(demounit.team);
				console.log("player joined " + name);
				break;
				
				
			case Constants.DDEMO_TEAMSELECT:
				for (var k = 0; k < this.players.length; k++)
				{
					if (demounit.DXID == this.players[k].DXID)
					{
						this.players[k].changeTeam(demounit.team);
					}
				}
				break;

				
			// player left
			case Constants.DDEMO_DROPPLAYER:
				for (var i = 0; i < this.players.length; i++) {
					if (this.players[i].DXID == demounit.DXID) {
						console.log("player left " + this.players[i].name);
						this.players[i].destroy();
						this.players.splice(i, 1);
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
				
			case Constants.DDEMO_CHATMESSAGE:
				var text = "";
				for (var i = 0; i < this.players.length; i++) {
					if (this.players[i].DXID == demounit.TDNETCHATMessage.DXID) {
						text += this.players[i].displayName + ": ";
						break;
					}
				}
				text += Utils.filterNickName(demounit.MessageText);
				
				Console.writeText(text);
				Sound.play('talk');
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
				//Sound.play('jumppad'); // played in item
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
				
				break;
				
				
		}
		
		// increase next frame recursively until all ticks will be handled
		this.nextFrame(gametic);
		
		return true;
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
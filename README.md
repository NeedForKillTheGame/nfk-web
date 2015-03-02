# NFK-WEB
Need For Kill - Quake 3 in 2d - WebGl game

## What NFK really is?
Original game called "Need For Kill" was developed by 3d[Power] in early 200x as Windows DirectX game application written in Delphi.
Game has multiplayer and dedicated servers on the Internet. There are several game modes: duel, teamplay, captu the flag, domintaion and more. One of the killer feature is a progamer physics model and game balance! 

Look this short demo: http://www.youtube.com/watch?v=FgvgVttl0zE
Move videos on http://www.youtube.com/user/nfk2d and http://www.youtube.com/user/needforkilldemo

You can download original Need For Kill game from official web-site: http://needforkill.ru/load/need_for_kill_0_77/22-1-0-494

## What NFK-WEB is?
This project is aimed to rewrite original game with modern web technologies keeping the same physics model and game balance.

Demo: http://nfk.pqr.su/game/

## Tehcical Details
- Graphics is rendered by <a href="http://www.pixijs.com/">Pixi.js</a> (WebGl with canvas fallback)
- JavaScript clien code is written in ECMAScript 2015 (former ES6) standart and trinspiled to ES5 using <a href="http://babeljs.io/">Babel</a>
- Build system: <a href="http://webpack.github.io/">webpack</a>

## Roadmap
1. Rewrite collision code (currentelly it looks like spagetti copied from old Delphi sources)
2. Write detailed manual for developers how to setup environment (node, webpack, ...), may be record a screencast
3. Implement first weapon: Railgun!
4. Create mutiplayer and dedicated server with first gamemode: Railarena
5. Launch official web-site with registration, playres statistic charts, matchmaking
6. More weapons and items, new game modes: duel, ctf and teamplay 
7. Enchanced map editing functionality
8. Brick textures, models skins
9. Visual effects
10. Profit!!!

## Join Us!
Project is open source under MIT lecince. Issues and pull requests are welcome!
Especially we are looking for Multiplayer/Network stack developer (both clien and server side)

Join us on irc: irc.wenet.ru:6667 #nfk (for russian use cp1251). Webgate to irc: http://needforkill.ru/index/web_chat/0-54

Gitter.im developers chat: [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/nfk2d/nfk-web?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

function Game(gamemode){
	//mode de jeu
	this.gamemode=gamemode
	//carte
	this.map
	//le jeu est en marche ?
	this.active = true
	//stock de l'interval
	this.interval
	//liste de tous les controlleurs du jeu
	this.controlleurList = new Array();
	for(var i=0;i<2;i++)
		this.controlleurList.push(new Controlleur)
	//le jeu est il en pause ?
	this.pause = false
	this.context
}
Game.prototype.launch = function(context){
	this.context = context
	var dimX = 21, dimY = 10
	this.map = new Map(dimX,dimY);
	//serpent
	this.map.addSnake(spriteSnake1,this.controlleurList[0],5,5)
	//obtacle
	for(var i=0;i<dimX;i++)
		for(var j=0;j<dimY;j++)
			if(i==0||j==0||i==dimX -1||j==dimY -1)
				this.map.addObstacle(i,j)
	for(var i=0;i<8;i++){
		this.map.spawnFood()
		this.map.spawnObstacle()
	}
}
Game.prototype.draw = function(){
	var ctx = this.context
	this.map.draw(ctx)
}
Game.prototype.update = function(){
	this.map.update()
	for(var i=0;i<this.controlleurList.length;i++)
		this.controlleurList[i].update();
	draw()
}
Game.prototype.pause_true = function(){
	this.pause = true
	this.interval = window.setInterval(update,1000/VITESSE);
}
Game.prototype.pause_false = function(){
	pause = false
	window.clearInterval(this.interval)
	this.draw()
}
//basculler le mode pause
Game.prototype.pause_toggle = function(){
	if(pause)
		pause_false()
	else
		pause_true()
}
//reaction au touches de clavier
var onkeyDown = function(e){
	var keyCode=e.which||e.keyCode;
	console.log("Recevoir la valeur "+keyCode+" du clavier .");
	switch(keyCode){
		case 37:
			controlleurList[0].changeDirection(DIRECTION.GAUCHE);
			break;
		case 38:
			controlleurList[0].changeDirection(DIRECTION.HAUT);
			break;
		case 39:
			controlleurList[0].changeDirection(DIRECTION.DROITE);
			break;
		case 40:
			controlleurList[0].changeDirection(DIRECTION.BAS);
			break;
		case 90:
			controlleurList[1].changeDirection(DIRECTION.HAUT);
			break;
		case 68:
			controlleurList[1].changeDirection(DIRECTION.DROITE);
			break;
		case 83:
			controlleurList[1].changeDirection(DIRECTION.BAS);
			break;
		case 81:
			controlleurList[1].changeDirection(DIRECTION.GAUCHE);
			break;
		case 80:case 32:
			pause_toggle();
			break;
		default:
			console.log("touche inutile");
			return false
			break;
	}
	e.preventDefault()
	return true
}
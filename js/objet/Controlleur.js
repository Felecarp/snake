//objet controlleur
function Controlleur (){
	//attributs
	this.direction=DIRECTION.HAUT;
	this.lastDirection=DIRECTION.HAUT;
}
//changer de direction
Controlleur.prototype.changeDirection = function(direction){
	if(direction%2!=this.lastDirection%2)
		this.direction=direction;
}
Controlleur.prototype.update = function(){
	this.lastDirection=this.direction;
}
//objet obstacle
function Obstacle(pX,pY){
	CaseCont.call(this,pX,pY);
	this.no_sprite = 0;
	//console.log("Nouvel obstacle en x = "+pX+" y = "+pY+" .");
	//attributs
}
Obstacle.prototype = Object.create(CaseCont.prototype);
Obstacle.prototype.constructor = Obstacle;
//renvoi la partie d'image a afficher
Obstacle.prototype.chooseImgPart = function(){
	return this.no_sprite;
}

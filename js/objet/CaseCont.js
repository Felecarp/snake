//objet CaseCont
function CaseCont(pX,pY){
	//attributs
	this.life = true;
	//position du CaseCont
	this.positionX = pX;
	this.positionY = pY;
}
CaseCont.prototype.dead = function(){
	life = false
}
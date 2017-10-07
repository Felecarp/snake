//varietes connus
var VARIETES = [
	new Variety(0,0,0),
	new Variety(1,3,1),
	new Variety(2,4,1),
	new Variety(3,5,1),
	//new Variety(4,-5,-1)
]
//objet aliments
function Food(variete,pX,pY){
	CaseCont.call(this,pX,pY);
	//attributs
	this.no_sprite = variete.no_sprite;
	this.score=variete.score;
	this.gain=variete.gain;
}
Food.prototype = Object.create(CaseCont.prototype);
Food.prototype.constructor = Food;
//renvoi la partie d'image a afficher
Food.prototype.chooseImgPart = function(){
	return this.no_sprite;
}
Food.prototype.dead = function(map){
	if(this.life){
		this.life = false;
		map.spawnFood();
		return true
	}
	return false
}
//objet variete de l'aliment
function Variety(no_sprite,score,gain){
	this.score=score;
	this.gain=gain;
	this.no_sprite=no_sprite;
}
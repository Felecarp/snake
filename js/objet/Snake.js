var DIRECTION = {
	HAUT: 2,
	DROITE: 3,
	BAS: 0,
	GAUCHE: 1
};
//objet Snake
function Snake (texture,no_controlleur){
	CaseCont.call(this,new Array(),new Array());
	console.log("Snake : Création d'un serpent .");
	this.texture=texture;
	this .score = 0;
	//longeur du serpent
	this.length=2;
	this.controlleur = controlleurList[no_controlleur];
}
Snake.prototype = Object.create(CaseCont.prototype);
Snake.prototype.constructor = Snake;

Snake.prototype.update = function(map){
	//on regarde sur quoi se trouve la tête du serpent
	if(this.life){
		var pos_tete = {x:this.positionX[0],y:this.positionY[0]};
		//on vérifie que la tête n'est pas sur la même case que le corp d'un serpent
		for(var i=0;i<map.snakeList.length;i++){
			var snake = map.snakeList[i]
			for(var j=0;j<snake.length;j++){
				if((snake!=this||j>0)&&pos_tete.x==snake.positionX[j]&&pos_tete.y==snake.positionY[j])
					this.dead();
			}
		}
		//on vérifie que la tête n'est pas sur la même case qu'un obstacle
		for(var i=0;i<map.obstacleList.length&&this.life;i++){
			var obst = map.obstacleList[i]
			if(pos_tete.x==obst.positionX && pos_tete.y==obst.positionY)
				this.dead();
		}
		//on vérifie que la tête n'est pas sur la même case qu'un aliment
		for(var i=0;i<map.foodList.length;i++){
			var food = map.foodList[i]
			if(food.life&&pos_tete.x==food.positionX&&pos_tete.y==food.positionY)
				this.eat(food, map);
		}
	}
	if(this.length<2){
		console.log("mort pas longueur trop faible");
		this.length = 2;
		this.dead();
	}
	if(this.score<0){
		console.log("mort pas score trop faible");
		this.dead();
	}
}

//manger un aliment
Snake.prototype.eat = function(food, map){
	this.score+=food.score;
	this.length+=food.gain;
	food.dead(map);
}
Snake.prototype.dead = function(){
	this.life = false
	this.texture = spriteSnakeSkel;
}
//renvoi la partie d'image a afficher
Snake.prototype.getSprite = function(i){
	var r;
	//si on est sur le bout de la queue
	if(i==this.length-1){
	if(this.positionX[i]==this.positionX[i-1]+1)
	r=16;
	else if(this.positionY[i]==this.positionY[i-1]+1)
	r=17;
	else if(this.positionX[i]==this.positionX[i-1]-1)
	r=18;
	else if(this.positionY[i]==this.positionY[i-1]-1)
	r=19;
	else
	r=0;
	}
	//si il se trouve sur la même ligne horizontale que le suivant
	else if(this.positionY[i]==this.positionY[i+1]){
	//si le suivant est sur la droite
	if(this.positionX[i]==this.positionX[i+1]-1){
	//si on est sur une tête
	if(i==0)
	r=0;
	//si le précédent est sur la gauche
	else if(this.positionX[i]==this.positionX[i-1]+1)
	r=4;
	//si le précedent est en haut
	else if(this.positionY[i]==this.positionY[i-1]+1)
	r=8;
	//si le précédent est en bas
	else if(this.positionY[i]==this.positionY[i-1]-1)
	r=12;
	//sinon erreur
	else
	r=0;
	}
	//si le suivant est sur la gauche
	if(this.positionX[i]==this.positionX[i+1]+1){
	//si on est sur une tête
	if(i==0)
	r=2;
	//si le précédent est sur la droite
	else if(this.positionX[i]==this.positionX[i-1]-1)
	r=6;
	//si le précédent est en bas
	else if(this.positionY[i]==this.positionY[i-1]-1)
	r=10;
	//si le précedent est en haut
	else if(this.positionY[i]==this.positionY[i-1]+1)
	r=14;
	//sinon erreur
	else
	r=0;
	}
	}
	//si il se trouve sur la même ligne verticale que le suivant
	else if(this.positionX[i]==this.positionX[i+1]){
	//si le suivant est en bas
	if(this.positionY[i]==this.positionY[i+1]-1){
	//si on est sur une tête
	if(i==0)
	r=1;
	//si le précédent est sur en haut
	else if(this.positionY[i]==this.positionY[i-1]+1)
	r=5;
	//si le précedent est sur la droite
	else if(this.positionX[i]==this.positionX[i-1]-1)
	r=9;
	//si le précédent est sur la gauche
	else if(this.positionX[i]==this.positionX[i-1]+1)
	r=13;
	//sinon erreur
	else
	r=0;
	}
	//si le suivant est en haut
	else if(this.positionY[i]==this.positionY[i+1]+1){
	//si on est sur une tête
	if(i==0)
	r=3;
	//si le précedent est en bas
	else if(this.positionY[i]==this.positionY[i-1]-1)
	r=7;
	//si le précedent est a gauche
	else if(this.positionX[i]==this.positionX[i-1]+1)
	r=11;
	//si le précédent est a droite
	else if(this.positionX[i]==this.positionX[i-1]-1)
	r=15;
	//sinon erreur
	else
	r=0;
	}
	}
	else
	r=0;
	return r;
};
var DIRECTION = {
	HAUT: 2,
	DROITE: 3,
	BAS: 0,
	GAUCHE: 1
}
//objet Snake
function Snake (sprite,no_controlleur){
	CaseCont.call(this,new Array(),new Array());
	console.log("Snake : Création d'un serpent .");
	this.sprite=sprite;
	this .score = 0;
	//longeur du serpent
	this.length=2;
	this.controlleur = controlleurList[no_controlleur];
}
Snake.prototype = Object.create(CaseCont.prototype);
Snake.prototype.constructor = Snake;

//on regarde sur quoi se trouve la tête du serpent
Snake.prototype.actuContact = function(map){
	if(this.life){
		var teteX = this.positionX[0],teteY = this.positionY[0]
		//on vérifie que la tête n'est pas sur la même case que le corp d'un serpent
		for(var i=0;i<map.snakeList.length;i++){
			var snake = map.snakeList[i]
			if(snake!=this)
				for(var j=1;j<snake.length;j++)
					if(teteX==snake.positionX[j]&&teteY==snake.positionY[j])
						this.dead();
		}
		//on vérifie que la tête n'est pas sur la même case qu'un obstacle
		for(var i=0;i<map.obstacleList.length&&this.life;i++){
			var obst = map.obstacleList[i]
			if(teteX==obst.positionX && teteY==obst.positionY)
				this.dead();
		}
		//on vérifie que la tête n'est pas sur la même case qu'un aliment
		for(var i=0;i<map.foodList.length;i++){
			var food = map.foodList[i]
			if(food.life&&teteX==food.positionX&&teteY==food.positionY)
				this.eat(food, map);
		}
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
	this.sprite = spriteSnakeSkel;
}
//renvoi la partie d'image a afficher
Snake.prototype.chooseImgPart = function(i){
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
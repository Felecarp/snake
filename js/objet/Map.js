function Map(dX,dY){
	///attributs
	//dimensions de la carte
	this.dimensionX = dX
	this.dimensionY = dY
	//liste des serpents présents sur la carte
	this.snakeList = 0
	//liste des aliments présents sur la carte
	this.foodList = 0
	//liste des obstacles présents sur la carte
	this.obstacleList = 0
	//sol
	this.ground = 0;
	// initialisation
	this.reset()
}
Map.prototype.reset = function(){
	this.snakeList = new Array()
	// sol
	this.ground=Array(this.dimensionX);
	for(var i=0;i<this.dimensionX;i++){
		this.ground[i]=Array(this.dimensionY);
		for(var j=0;j<this.dimensionY;j++)
			this.ground[i][j]=parseInt(Math.random()*3);
	}
	//serpents
	this.snakeList=new Array();
	//aliments
	this.foodList=new Array();
	//obstacles
	this.obstacleList=new Array();
}
//renvoi le nombre d'entités présentes a une certaine position
Map.prototype.howManyEntityTo = function(pX,pY){
	var compteur=0;
	//les serpents
	for(var i=0;i<this.snakeList.length;i++){
		var snake = this.snakeList[i]
		if(snake.life)
			for(var j=0;j<snake.length;j++)
				if(pX==snake.positionX[j]&&pY==snake.positionY[j])
					compteur++;
	}
	for(var i=0;i<this.foodList.length;i++){
		var food = this.foodList[i]
		if(food.life && pX==food.positionX&&pY==food.positionY)
			compteur++;
	}
	for(var i=0;i<this.obstacleList.length;i++){
		var obst = this.obstacleList[i]
		if(obst.life && pX==obst.positionX&&pY==obst.positionY)
			compteur++;
	}
	return compteur;
}
//dessine la carte
Map.prototype.draw = function(ctx,width,height){
	// console.log("Dessiner la carte");
	ctx.clearRect(0,0,width,height);
	//les object fixes
	for(var i=0;i<this.dimensionX;i++){
		for(var j=0;j<this.dimensionY;j++){
			//la grille
			ctx.strokeRect(i*DIMCASESX,j*DIMCASESY,DIMCASESX,DIMCASESY);
			//le terrain
			ctx.drawImage(spriteGround,32*this.ground[i][j],0,32,32,i*DIMCASESX,j*DIMCASESY,DIMCASESX,DIMCASESY);
		}
	}
	//les aliments
	for(var i=0;i<this.foodList.length;i++){
		var food = this.foodList[i]
		if(food.life)
			ctx.drawImage(spriteFood	,32*food.chooseImgPart(),0,32,32,food.positionX*DIMCASESX,food.positionY*DIMCASESY,DIMCASESX,DIMCASESY);
	}
	//les obstacles
	for(var i=0;i<this.obstacleList.length;i++){
		var obst = this.obstacleList[i]
		if(obst.life)
			ctx.drawImage(spriteObstacle,32*obst.chooseImgPart(),0,32,32,obst.positionX*DIMCASESX,obst.positionY*DIMCASESY,DIMCASESX,DIMCASESY);
	}
	//les serpents
	for(var i=0;i<this.snakeList.length;i++){
		var snake = this.snakeList[i];
		for(var j=0;j<snake.length;j++){
			var imgPart =snake.chooseImgPart(j);
			ctx.drawImage(snake.sprite,(imgPart%4)*32,parseInt(imgPart/4)*32,32,32,snake.positionX[j]*DIMCASESX,snake.positionY[j]*DIMCASESY,DIMCASESX,DIMCASESY);
		}
	}
	//le score
	ctx.font = "20px Arial";
	ctx.fillText("Score : "+this.snakeList[0].score,20,20);
}
//actualise les entites
Map.prototype.update = function(){
	//console.log("Actualiser les entitités")
	//on déplace tous les serpents en fonction de la direstion indiqué par leur controlleur
	for(var i=0;i<this.snakeList.length;i++){
		var snake = this.snakeList[i]
		snake.actuContact(this);
		if(snake.life){
			//on fait suivre le corp
			for(var i=snake.length;i>0;i--){
				snake.positionX[i]=snake.positionX[i-1];
				snake.positionY[i]=snake.positionY[i-1];
			}
			//on choisi de faire emprunter une direction à la tête
			switch(snake.controlleur.direction){
				case DIRECTION.HAUT:
					snake.positionY[0]--;
					break;
				case DIRECTION.DROITE:
					snake.positionX[0]++;
					break;
				case DIRECTION.BAS:
					snake.positionY[0]++;
					break;
				case DIRECTION.GAUCHE:
					snake.positionX[0]--;
					break;
			}
			//console.log(controlleur[snakeList[j].no_controlleur].direction);
		}
	}
}
//ajoute un serpent à la carte
Map.prototype.addSnake = function(img, no_controleur, positionX, positionY){
	var snake = new Snake(img, no_controleur)
	this.snakeList.push(snake);
	for(var i=0;i<snake.length;i++){
		snake.positionX[i]=positionX;
		snake.positionY[i]=positionY;
	}
}
//ajoute un aliment à la carte et renvoi false en cas d'impossiblité
Map.prototype.addFood = function(variete,pX,pY){
	if(this.howManyEntityTo(pX,pY)==0){
		var food = new Food(variete,pX,pY)
		this.foodList.push(food);
		return true
	}
	return false
}
//ajoute un obstacle à la carte et renvoi false en cas d'impossiblité
Map.prototype.addObstacle = function(pX,pY){
	if(this.howManyEntityTo(pX,pY)==0){
		var obstacle = new Obstacle(pX,pY)
		this.obstacleList.push(obstacle);
		return true
	}
	return false
}
//fait apparaitre un nouvel aliment à une position aleatoire
Map.prototype.spawnFood = function(){
	var pX,pY;
	var variete = VARIETES[parseInt(Math.random()*VARIETES.length)]
	do{
		pX=parseInt(Math.random()*this.dimensionX);
		pY=parseInt(Math.random()*this.dimensionY);
	}while(!this.addFood(variete,pX,pY));
}
//fait apparaitre un nouvel obstacle à une position aleatoire
Map.prototype.spawnObstacle = function(){
	var pX,pY;
	do{
		pX=parseInt(Math.random()*this.dimensionX);
		pY=parseInt(Math.random()*this.dimensionY);
	}while(!this.addObstacle(pX,pY));
}
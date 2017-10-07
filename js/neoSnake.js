///constantes
//vitesse de déplacement des serpents en cases par secondes
const VITESSE = 2;
//dimension des cases des cartes en pixels
const DIMCASESX=32,DIMCASESY=32
///variables
var map;
//liste de tous les controlleurs de la partie
var controlleurList = new Array();
controlleurList.push(new Controlleur);
controlleurList.push(new Controlleur);
//images a charger
var spriteGround=new Image();
spriteGround.src="img/ground.png";

var spriteSnake1=new Image();
spriteSnake1.src="theme/SnakeG.png";

var spriteSnake2=new Image();
spriteSnake2.src="theme/SnakeC.png";

var spriteSnakeSkel=new Image();
spriteSnakeSkel.src="theme/SnakeSkel.png"

var spriteFood=new Image();
spriteFood.src="theme/food.png";

var spriteObstacle=new Image();
spriteObstacle.src="theme/obstacle.png";
///fonctions
//transformer un canvas en jeu
var transform = function(canvas){
	//initialiser le jeu
	var initGame = function(){
		var dimX = 21, dimY = 10;
		map = new Map(dimX,dimY);
		//serpent
		map.addSnake(spriteSnake1,0,5,5)
		/*if(game_mode==2){
			map.addSnake(spriteSnake2,1,10,5)
		}*/
		//bordure d'obtacle
		for(var i=0;i<dimX;i++){
			for(var j=0;j<dimY;j++){
				if(i==0||j==0||i==dimX -1||j==dimY -1)
					map.addObstacle(i,j)
			}
		}
		//génération d'obstacles et de nouriture aléatoire
		for(var i=0;i<8;i++){
			map.spawnFood();
			map.spawnObstacle();
		}
	}
	// variables
	var context = canvas.getContext("2d");
	var width = window.innerWidth, height= window.innerHeight;
	//travail du ratio
	(function(){
		var ratio = window.devicePixelRatio;
		canvas.width=width*ratio;
		canvas.height=height*ratio;
		canvas.style.width=width+"px";
		canvas.style.height=height+"px";
		context.scale(ratio,ratio);
		//console.log('ratio :'+ratio)
	})();
	initGame();
	map.draw(context,width,height)
	setInterval(function(){
		map.update()
		for(var i=0;i<controlleurList.length;i++)
			controlleurList[i].update();
	},1000/VITESSE);
	setInterval(function(){
		map.draw(context,width,height)
	},1000/VITESSE);
}
//reaction aux touches de clavier
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
		default:
			console.log("touche inutile");
			return false
			break;
	}
	e.preventDefault()
	return true
}
window.addEventListener('keydown',onkeyDown)

//quand la page est chargé
window.onload = function(){
	//on transforme le snake_canvas
	var snake_canvas = document.getElementById("snake_canvas");
	transform(snake_canvas);
}
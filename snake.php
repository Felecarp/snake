<!--DOCTYPE html-->
<html>
	<head>
		<meta charset="utf-8">
		<title>Snake</title>
		<meta title="author" content="Aurélien Briens">
		<meta title="copyright" content="PotsProd">
	</head>
	<body style="margin:0;overflow:hidden;" onKeyDown="onkeyDown(event)">
		<canvas id="canvas"></canvas>
		<script>
			//*declaration des variables
			var //affichage
				canvas=document.getElementById("canvas"),
				context=canvas.getContext("2d"),
				height=window.innerHeight,
				width=window.innerWidth,
				ratio=window.devicePixelRatio,
				//jeu
				mode_game=0,//0:score;2=duel
				//themes
				themes=new Array(),
				//liste de tous les serpents de la partie
				snakes,
				//liste de tous les controlleurs de la partie
				controlleurs,
				//liste de tous les aliments de la partie
				foods,
				//liste de tous les obstacles de la partie
				obstacles,
				//contient chaque le numéro de l'image affichée pour chaque parcelle du terrain
				groundCont,
				//liste des différents aliments existants
				foodModeles,
				compteur=0,
				vitesse=70,
				//dimmension du plateau et de ses cases
				dimmensionX=21,
				dimmensionY=10,
				dimCaseX=64,
				dimCaseY=64,
				spawnPointX=5,
				spawnPointY=5,
				//images,
				spriteGround=new Image(),
				spriteSnake1=new Image(),
				spriteSnake2=new Image(),
				spriteSnakeSkel=new Image(),
				spriteFood=new Image(),
				spriteObstacle=new Image();
			//*objets
			//objet thème
			function Theme (sGround,sFood,sObstacle,sSnake1,sSnake2,sSnakeD){
				this .spriteGround=new Image();
				this .spriteGround.src=sGround;
				this .spriteFood=new Image();
				this .spriteFood.src=sFood;
				this .spriteObstacle=new Image();
				this .spriteObstacle.src=sObstacle;
				this .spriteSnake1=new Image();
				this .spriteSnake1.src=sSnake1
				this .spriteSnake2=new Image();
				this .spriteSnake2.src=sSnake2
				this .spriteSnakeD=new Image();
				this .spriteSnakeD.src=sSnakeD;
			}
			//objet CaseCont
			function CaseCont (img_src,pX,pY){
				///variables
				this .life= true;
				//image du CaseCont
				this .img= img_src;
				//position du CaseCont
				this .positionX=pX;
				this .positionY=pY;
				///methodes
				this .chooseImgPart = function(){}
				//renvoi bool true si le casecont est seul sur sa case
				this .isAlone = function(){
					var compteur=0,
						px=this .positionX,
						py=this .positionY;
					if(this .life){
						//les serpents
						for(var i=0;i<snakes.length;i++)
							if(snakes[i].life)
								for(var j=0;j<snakes[i].length;j++)
									if(px==snakes[i].positionX[j]&&py==snakes[i].positionY[j])
										compteur++;
						for(var i=0;i<foods.length;i++){
							if(foods[i].life && px==foods[i].positionX&&py==foods[i].positionY)
								compteur++;
						}
						for(var i=0;i<obstacles.length;i++){
							if(obstacles[i].life&&px==obstacles[i].positionX&&py==obstacles[i].positionY)
								compteur++;
						}
					}
					//console.log("x = "+px+" y = "+py+" compteur = "+compteur);
					return compteur;
				}
			}
			//objet Snake
			function Snake (img_src,no_controlleur){
				CaseCont.call(this,img_src,new Array(),new Array());
				console.log("Snake : Création d'un serpent .");
				this .score = 0;
				//longeur du serpent
				this.length=2;
				this.no_controlleur=no_controlleur;
				///methode
				this .actuContact = function(){
					//on vérifie que la tête n'est pas sur la même case qu'un serpent
					for(var i=0;i<snakes.length&&this .life;i++){
						for(var j=0;j<snakes[i].length&&this .life;j++){
							if(!(j==0&&this==snakes[i])){
								this .life=!(this .positionX[0]==snakes[i].positionX[j]&&this .positionY[0]==snakes[i].positionY[j]);
							}
						}
					}
					//on vérifie que la tête n'est pas sur la même case qu'un obstacle
					for(var i=0;i<obstacles.length&&this .life;i++){
						if(this.positionX[0]==obstacles[i].positionX&&this .positionY[0]==obstacles[i].positionY){
								this .life=false;
							}
						}
					//on vérifie que la tête n'est pas sur la même case qu'un aliment
					if(this .life)
						for(var i=0;i<foods.length;i++)
							if(this.positionX[0]==foods[i].positionX&&this .positionY[0]==foods[i].positionY&&foods[i].life)
								this.eat(foods[i]);
				}
				this .eat = function(food){
					this .score+=food.stat.score;
					this .length+=food.stat.gain;
					food.life=false;
					Food.spawn();
					if(this.length>=(dimmensionX-2)*(dimmensionY-2))
						this.length=(dimmensionX-2)*(dimmensionY-2)-1;
				}
				this .chooseImgPart = function(i){
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
			}
			//objet controlleur
			function Controlleur (){
				///variables
				this.direction=0;
				this.lastDirection=0;
				///methode
				//methode pour changer de direction
				this .changeDirection = function(no){
					if(no%2!=this.lastDirection%2)
						this.direction=no;
				}
				this .update = function(){
					this.lastDirection=this.direction;
				}
			}
			//objet obstacle
			function Obstacle(pX,pY,no_img){
				CaseCont.call(this,spriteObstacle,pX,pY);
				//console.log("Nouvel obstacle en x = "+pX+" y = "+pY+" .");
				//variables
				this .no_img=no_img;
				//methodes
				this .chooseImgPart = function(){
					return no_img;
				}
			}
			//objet aliments
			function Food(no_mod,pX,pY){
				CaseCont.call(this,spriteFood,pX,pY);
				//variables
				this .no_mod=no_mod;
				//methodes
				this .chooseImgPart = function(){
					return no_img;
				}
				this .stat = foodModeles[this .no_mod];
			}
			//modèle d'aliment
			function FoodModele(no_img,score,gain){
				this .score=score;
				this .gain=gain;
				this .no_img=no_img;
			}
			//*fonctions
			//initialise le systeme
			function initSystem(){
				//affichage
				canvas.width=width*ratio;
				canvas.height=height*ratio;
				canvas.style.width=width+"px";
				canvas.style.height=height+"px";
				context.scale(ratio,ratio);
				//sprites
				<?php
					function buidTheme($repaire,$addr){
						$file=fopen($addr,'r');
						$lines=array();
						$lineCount=LineCount($file);
						fseek($file,0);
						for ($i=0;$i<$lineCount;$i++)
							$lines[]=fgets($file,255);
						fclose($file);
						//lecture
						$sGround="ground.png";$sFood="food.png";$sObstacle="obstacle.png";$sSnake1="snake.png";$sSnake2="snake.png";$sSnakeD="snakeD.png";
						for($i=0;$i<$lineCount;$i++){
						$search=strpos($lines[$i],"repair:");
						if($search!==false){
							$repaire = substr($lines[$i],$search);
							$lines = array_merge(array_slice($lines,$search+1),array_slice($lines,0,$search));
						}else{
							buildTheme($repaire,$lines[$i]);
						}
					}
						echo "themes.push(new Theme(".$repaire.$sGround.",".$repaire.$sFood.",".$repaire.$sObstacle.",".$repaire.$sSnake1.",".$repaire.$sSnake2.",".$repaire.$sSnakeD."))";
					}
					function LineCount($file) {
						fseek($file,0);
						$fileCount=0;
						while (!feof($file)) {
							fgets($file,255);
						$fileCount++;
						}
						return($fileCount);
					}
					$file=fopen('theme.txt','r');
					$lines=array();
					$lineCount=LineCount($file);
					fseek($file,0);
					for ($i=0;$i<$lineCount;$i++)
						$lines[]=fgets($file,255);
					fclose($file);
					//lecture
					$repaire=false;
					//parcourt les lignes
					for($i=0;$i<$lineCount;$i++){
						//si la ligne définit le repertoire
						$search=strpos($lines[$i],"repair:");
						if($search!==false){
							$repaire = substr($lines[$i],$search);
							$lines = array_merge(array_slice($lines,$search+1),array_slice($lines,0,$search));
						}else{
							buildTheme($repaire,$lines[$i]);
						}
					}
				?>
				spriteGround.src="theme/ground.png";
				spriteSnake1.src="theme/SnakeG.png";
				spriteSnake2.src="theme/SnakeC.png";
				spriteSnakeSkel.src="theme/SnakeSkel.png"
				spriteFood.src="theme/food.png";
				spriteObstacle.src="theme/obstacle.png";
				//modeles d'aliments
				foodModeles=[
					new FoodModele(0,0,0),
					new FoodModele(1,10,1),
					new FoodModele(2,15,1),
					new FoodModele(3,20,1)
					];
			}
			//initialise la partie
			function initGame(){
				//sol
				ground=Array(dimmensionX);
				for(var x=0;x<dimmensionX;x++){
					ground[x]=Array(dimmensionY);
					for(var y=0;y<dimmensionY;y++)
						ground[x][y]=parseInt(Math.random()*3);
				}
				//controlleur
				controlleurs=[new Controlleur(),new Controlleur()];
				//serpent
				snakes=new Array();
				snakes.push(new Snake(spriteSnake1,0));
				if(mode_game==2)
					snakes.push(new Snake(spriteSnake2,1));
				for(var i=0;i<snakes.length;i++){
					for(var j=0;j<snakes[i].length;j++){
						snakes[i].positionX[j]=spawnPointX;
						snakes[i].positionY[j]=spawnPointY;
					}
				}
				snakes[0].positionX[0]=15;
				snakes[0].positionY[0]=8;
				if(mode_game==2){
					snakes[1].positionX[0]=2;
					snakes[1].positionY[0]=8;
				}
				
				//aliment
				foods=new Array();
				//obtacle
				obstacles=new Array();
				for(var i=0;i<dimmensionX;i++){
					for(var j=0;j<dimmensionY;j++){
						if(i==0||j==0||i==dimmensionX -1||j==dimmensionY -1)
							obstacles.push(new Obstacle(i,j,0));
					}
				}
				//
				for(var i=0;i<4;i++){
					Obstacle.spawn();Obstacle.spawn();
					Food.spawn();Food.spawn();
				}
			}
			//
			function annimation(){
				if(compteur==0){
					update();
					draw();
				}
				compteur++;
				compteur=compteur%(100-vitesse);
				requestAnimationFrame(annimation);
			}
			//affichage
			function draw(){
				//console.log("affichage x="+snakes[0].positionX[0]+" y="+snakes[0].positionY);
				context.clearRect(0,0,width,height);
				//les object fixes
				for(var x=0;x<dimmensionX;x++){
					for(var y=0;y<dimmensionY;y++){
						//la grille
						context.strokeRect(x*dimCaseX,y*dimCaseX,dimCaseX,dimCaseY);
						//le terrain
						if(spriteGround.complete){
							context.drawImage(spriteGround,32*ground[x][y],0,32,32,x*dimCaseX,y*dimCaseY,dimCaseX,dimCaseY);
						}
					}
				}
				//les aliments
				for(var i=0;i<foods.length;i++){
					if(foods[i].life)
						context.drawImage(foods[i].img,32*foods[i].stat.no_img,0,32,32,foods[i].positionX*dimCaseX,foods[i].positionY*dimCaseY,dimCaseX,dimCaseY);
				}
				//les obstacles
				for(var i=0;i<obstacles.length;i++){
					if(obstacles[i].life)
						context.drawImage(obstacles[i].img,32*obstacles[i].no_img,0,32,32,obstacles[i].positionX*dimCaseX,obstacles[i].positionY*dimCaseY,dimCaseX,dimCaseY);
				}
				//les serpents
				for(var i=0;i<snakes.length;i++){
					for(var j=0;j<snakes[i].length;j++){
						var snake = snakes[i];
						var spriteId=snake.chooseImgPart(j);
						context.drawImage((snake.life)?snake.img:spriteSnakeSkel,(spriteId%4)*32,parseInt(spriteId/4)*32,32,32,snake.positionX[j]*dimCaseX,snake.positionY[j]*	dimCaseY,dimCaseX,dimCaseY);
					}
				}
				//le score
				context.font = "20px Arial";
				context.fillText("Score : "+snakes[0].score,20,20);
			}
			//mise a jour des variables
			function update(){
				//on déplace tous les serpents en fonction de la direstion indiqué par leur controlleur
				for(var j=0;j<snakes.length;j++){
					snakes[j].actuContact();
					if(snakes[j].life){
					//on fait suivre le corp
					for(var i=snakes[j].length;i>0;i--){
						snakes[j].positionX[i]=snakes[j].positionX[i-1];
						snakes[j].positionY[i]=snakes[j].positionY[i-1];
					}
					//on choisi de faire emprunter une direction à la tête
					switch(controlleurs[snakes[j].no_controlleur].direction){
						case 0:
							snakes[j].positionY[0]=snakes[j].positionY[0]-1;
							break;
						case 1:
							snakes[j].positionX[0]=snakes[j].positionX[0]+1;
							break;
						case 2:
							snakes[j].positionY[0]=snakes[j].positionY[0]+1;
							break;
						case 3:
							snakes[j].positionX[0]=snakes[j].positionX[0]-1;
							break;
					}
					//console.log(controlleur[snakes[j].no_controlleur].direction);
					}
				}
				//on actualise les controlleurs
				for(var i=0;i<controlleurs.length;i++){
					controlleurs[i].update();
				}
				
			}
			//reaction au touches de clavier
			function onkeyDown(e){
				//console.log("On reçoit la valeur which "+e.which+" et la valeur keycode "+e.keyCode+".");
				var s=e.which;
				if(s==0)
					s=e.keyCode;
				switch(s){
					case 37:
						controlleurs[0].changeDirection(3);
						break;
					case 38:
						controlleurs[0].changeDirection(0);
						break;
					case 39:
						controlleurs[0].changeDirection(1);
						break;
					case 40:
						controlleurs[0].changeDirection(2);
						break;
					case 90:
						controlleurs[1].changeDirection(0);
						break;
					case 68:
						controlleurs[1].changeDirection(1);
						break;
					case 83:
						controlleurs[1].changeDirection(2);
						break;
					case 81:
						controlleurs[1].changeDirection(3);
						break;
					default:
						console.log("touche inutile");
						break;
				}
				//console.log(controlleur[0].direction);
			}
			//apparition des objets
			Food.spawn = function(){
				var px,py,food,
					no_mod=parseInt(Math.random()*foodModeles.length);
				do{
					px=parseInt(Math.random()*dimmensionX);
					py=parseInt(Math.random()*dimmensionY);
					food=new Food(no_mod,px,py);
				}while(food.isAlone()!=0);
				foods.push(food);
			}
			Obstacle.spawn = function(){
				var px,py,obs,
					no_img=parseInt(Math.random()*0);
				do{
					px=parseInt(Math.random()*dimmensionX);
					py=parseInt(Math.random()*dimmensionY);
					obs=new Obstacle(px,py,no_img);
				}while(obs.isAlone()!=0);
				obstacles.push(obs);
			}
			//*instructions du programme
			initSystem();
			initGame();
			draw();
			annimation();
		</script>
	</body>
</html>
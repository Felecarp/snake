function Menu(){
	this.active = true
	this.button_select = 0
	this.button_names = ['score','longueur','deux joueurs']
	this.ctx
	window.addEventListener('keydown',this.onkeyDown)
}
Menu.prototype.draw = function(ctx,width,height){
	ctx.drawImage(menu_Image,0,0,width,height)
	ctx.strokeStyle='black'
	ctx.font = '35px Trebuchet'
	ctx.textAlign = 'center'
	var pX=width/5*3,pY,dX=width/3,dY=height/6
	for(var i=0;i<this.button_names.length;i++){
		var button_name = this.button_names[i];
		pY=i*height/5+height/3
		if(i==this.button_select)
			ctx.fillStyle = 'rgb(100,100,100)'
		else
			ctx.fillStyle='rgb(170,170,170)'
		ctx.fillRect(pX,pY,dX,dY)
		ctx.strokeRect(pX,pY,dX,dY)
		ctx.fillStyle='black'
		ctx.fillText(button_name,pX+dX/2,pY+dY/3*2)
	}
}
//reaction au touches de clavier
Menu.prototype.onkeyDown = function(e){
	var keyCode=e.which||e.keyCode;
	console.log("Recevoir la valeur "+keyCode+" du clavier .");
	switch(keyCode){
		case 38:
			this.button_select++;
			break;
		case 40:
			this.button_select--;
			break;
		default:
			console.log("touche inutile");
			return false
			break;
	}
	e.preventDefault()
	return true
}
	
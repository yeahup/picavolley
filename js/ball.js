
class Ball {
	
	constructor(object, object_hyper, object_trail, object_punch, object_shadow, t) {
		this.object = object;
		this.object.depth = 5;
		this.object_hyper = object_hyper;
		this.object_hyper.depth = 4;
		this.object_trail = object_trail;
		this.object_trail.depth = 3;
		this.object_punch = object_punch;
		this.object_punch.depth = 6;
		this.object_shadow = object_shadow;
		this.last_1 = {x:object.x,y:object.y};
		this.last_2 = {x:object.x,y:object.y};
		this.t = t;
		this.is_on_ground = false;
		this.state = 1;
		this.setEffVisible(false);
	}
	
	setEffVisible(visible){
		this.object_trail.setVisible(visible);
		this.object_hyper.setVisible(visible);
	}
	
	setTrail(){
		this.object_trail.x = this.last_1.x;
		this.object_trail.y = this.last_1.y;
	}
	
	setHyper(){
		this.object_hyper.x = this.last_2.x;
		this.object_hyper.y = this.last_2.y;
	}
	
	setLast(){
		this.last_2 = this.last_1;
		this.last_1 = {x:this.object.x,y:this.object.y};
	}
	
	setShadow()
	{
		this.object_shadow.x = this.object.x;
	}
	
	setTrailMotion()
	{
		this.setLast();
		this.setTrail();
		this.setHyper();
	}
	
	setAll()
	{
		this.setTrailMotion();
		this.setShadow();
	}
	
	punch(){
		this.object_punch.x = this.object.x;
		this.object_punch.y = this.object.y + this.object.height/2;
		this.object_punch.setAlpha(1);
		this.object_punch.setScale(1);
		
		var target = this.object_punch;
		this.t.tweens.add({
			targets: target,
			scaleX:0,
			scaleY:0,
			duration: 500,
			ease: 'linear',
			repeat:0,
			yoyo:false
		}).addListener("complete", function(){
			
			target.setAlpha(0);
		});
		
	}
	
	isPunching(){
		return this.object_punch.alpha != 0;
	}
	
	playMotion(attr)
	{
		this.object.play(attr);
	}
	
	playHyperMotion(attr)
	{
		this.object_hyper.play(attr);
	}
	
	playTrailMotion(attr)
	{
		this.object_trail.play(attr);
		return this.object;
	}

}

class Vector2 {
	
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	
	scala(){
		return Math.sqrt(this.x*this.x+this.y*this.y);
	}
	
	unit(){
		var scala = this.scala();
		return {x:this.x/scala,y:this.y/scala};
	}
	
	setScala(amount){
		var scala = this.scala();
		this.x = this.x*amount/scala
		this.y = this.y*amount/scala;
	}
	
	get(){
		return {x:this.x, y:this.y}
	}
	
}
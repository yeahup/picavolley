
class Player {
	
	constructor(is_opposite, state, speed, diving_speed, object, object_shadow, is_computer, is_me, team, baseFlip) {
		
	console.log("new player");
	console.log(t.anims);
		this.is_opposite = is_opposite
		this.state = state
		this.speed = speed
		this.is_computer = is_computer
		this.is_me = is_me
		this.diving_speed = diving_speed
		this.object = object
		this.object.depth = 5;
		this.yVelocity = 0;
		this.team = team;
		this.immutable = false;
		this.baseFlip = baseFlip;
		this.object_shadow = object_shadow;
		this.object_shadow.depth = 4;
		
		this.object.setFrictionX(0);
	
		this.object.play('pica walk').setScale(1);
		this.object.setCollideWorldBounds(true);
		this.object.setBounce(0);
		
		this.flipToBase();
		this.basePosition = {x:object.x,y:object.y};
		
	}
	
	resetBody()
	{
		this.object.x = this.basePosition.x;
		this.object.y = this.basePosition.y;
		this.object.setVelocity(0,0);
		this.flipToBase();
		this.state = 1;
		this.playMotion("pica walk");
	}
	
	setState(state)
	{
		this.state = state;
	}
	
	getState()
	{
		return this.state;
	}
	
	getImmutable()
	{
		return this.immutable;
	}
	
	setImmutable(immutable)
	{
		this.immutable = immutable;
	}
	
	getBaseFlip()
	{
		return this.immutable;
	}
	
	setBaseFlip(baseFlip)
	{
		this.baseFlip = baseFlip;
	}
	
	flipTo(flip)
	{
		this.object.flipX = flip;
	}
	
	flipToBase()
	{
		this.object.flipX = this.baseFlip;
	}
	
	setShadow()
	{
		this.object_shadow.x = this.object.x;
	}
	
	playMotion(attr)
	{
		this.object.play(attr);
		return this.object;
	}
	
	moveX(x)
	{
		this.object.x += x;
		this.object_shadow.x = this.object.x;
	}
	
	getX()
	{
		return this.object.x;
	}
	
	setX(x)
	{
		this.object.x = x;
		this.object_shadow.x = this.object.x;
	}
	
}
/* Author: Matthew Conlen

 */

var movers = [];
var count = 0;
var t;
var updating = 0;
var f = 10;
var zmax = -15;

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random number between min and max
 */
function getRandomArbitary (min, max) {
    return Math.random() * (max - min) + min;
}

function Mover(myElement) {
	var elt = myElement;
    $(elt).show();
//    $(elt).css("visibility", "visible");
	var height = $(elt).height();
    console.log("h: "+ height);
	var width = $(elt).width();
    console.log("w: "+ width);
	var x = getRandomInt(0, $(window).width() - width);
	var y = getRandomInt(0, $(window).height() - height); 
	var z = getRandomInt(-1, zmax + 1);
	var dx = getRandomInt(-3,3);
	var dy = getRandomInt(-3,3);
	var dz = getRandomArbitary(-.007,.007);

	this.update = function() {
		if(x <= 0 || x + width >= $(window).width()) {
			dx = -dx;
		}
		if(y <= 0 || y + height >= $(window).height()) {
			dy = -dy;
		}
		if(z >=-1 || z <= zmax ) {
			dz = -dz;
		}
		x += dx;
		y += dy;
		z += dz	;
		dx += getRandomArbitary(-.005,.005);
		dy += getRandomArbitary(-.005,.005);
		dz += getRandomArbitary(-.0001,.0001);
		return this;
	}

	this.getCoords = function() {
		return {
			"x" : x,
			"y" : y,
			"z" : z
		};
	}

	this.draw = function() {
		if(z == 0) {
			$(elt).offset({
				top : y,
				left : x
			}).css({"z-index": Math.round(z), "max-height" : height + 'px', "max-width" : width+ 'px'});
			return this;
		}
		var yp = (y - $(window).height()/2.) * (1.0 / -z) + $(window).height()/2.;
		var xp = (x - $(window).width()/2.) * (1.0 / -z) + $(window).width()/2.;
		$(elt).offset({
			top : yp,
			left : xp
		}).css({"z-index": Math.round(z), "max-height" : Math.round(height / -z) + 'px', "max-width" : Math.round(width / -z) + 'px'});
		return this;
	}
}


function timedUpdate() {

	for(i in movers) {
		movers[i].update().draw();
	}	

	t = setTimeout("timedUpdate()", 5   );
}

function doUpdate() {
	if(!updating) {
		updating = 1;
		timedUpdate();
	}
}


jQuery(document).ready(function($) {
    
    $('.mover').each(function(){
	   $(this).attr('src',$(this).attr('src')+'?'+new Date().getTime())  
	}).load(function() {
        movers.push(new Mover(this));
    });

	doUpdate();
});

function largeurl(id) {
    
}

function mousedown(id) {
	$(id).document.createElement("<div class='magnifier' />");
}

function mousedown(id) {
}

var tilesize = 400;
var magsize = 400;

function hideMagnifier() {
	$("magnifier").css("display","none");
}

function pageclick(img,mousepos) {
	hideMagnifier();
	showMagnifier(img,mousepos);
}

function showMagnifier(img,mousepos) {
	var magnifier = $("magnifier");
	var children = $(magnifier).children();
	children.remove();
	var pos = {left: mousepos.x - tilesize/2, top: mousepos.y - tilesize/2};
	$(magnifier).position(pos);
	
	var imgpos = $(img).offset();
	var nsize = normalsize(img);
	var lsize = largesize(img);

	var lpos = { x: (mousepos.x - imgpos.left) * lsize.width / nsize.width,
				 y: (mousepos.y - imgpos.top) * lsize.height / nsize.height };
	var tiles = tilesAround(img,lpos,magsize);
	
	var tile;
	for(tile in tiles) {
		var img = $("<img style='position: absolute' />");
		$(img).css("position","absolute");
		$(img).offset({left: tile.ulx, top: tile.uly});
		$(img).width(tile.width);
		$(img).height(tile.height);
		$(magnifier).children().append($(img));
	}
	
	$(magnifier).css("display","block");
}

function tilesAround(img,lpos,magsize) {
	var upperLeft = {x: lpos.x - magsize / 2, y: lpos.y - magsize / 2};
	var lowerRight = {x: lpos.x + magsize / 2, y: lpos.y + magsize / 2};
	var lsize = largesize(img);
	var tiles=[];
	
	for(var x = upperLeft.x; x - tilesize < lowerRight.x; x += tilesize) {
		for(var y = upperLeft.y; y - tilesize < lowerRight.y; y += tilesize) {
			var width = Math.min(x+tilesize,lsize.width) - x;
			var height = Math.min(y+tilesize,lsize.height) - y;
			tiles.push( {ix: x, iy: y, ulx: x, uly: y, width: width, height: height} );
		}			
	}

	return tiles;
}


function basename(img) {
	return $(img).attr('src').replace('images/.*/','');
}

function tile(img,x,y) {
		
}

function largesize(img) {
	return {width: 2569, height: 3248 };
}

function normalsize(img) {
	return {width: 595, height: 779 };
}

function loaded() {
	$('.page').click(function(event) {
		// alert(event.pageX+" "+event.pageY+" "+event.target);

		
		showMagnifier(event.target,{x: event.pageX, y: event.pageY});
  	});
}



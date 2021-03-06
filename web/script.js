var images = [
    "S001CO103.jpg",
    "S002CO103.jpg",
    "S003CO103.jpg",
    "S004CO103.jpg",
    "S005CO103.jpg",
    "S006CO103.jpg",
    "S007CO103.jpg",
    "S008CO103.jpg",
    "S009CO103.jpg",
    "S010CO103.jpg",
    "S011CO103.jpg",
    "S012CO103.jpg",
    "S013CO103.jpg",
    "S014CO103.jpg",
    "S015CO103.jpg",
    "S016CO103.jpg",
    "S017CO103.jpg",
    "S018CO103.jpg",
    "S019CO103.jpg",
    "S020CO103.jpg",
    "S021CO103.jpg",
    "S022CO103.jpg"
];


function largeurl(id) {
    
}

function mousedown(id) {
	$(id).document.createElement("<div class='magnifier' />");
}

function mousedown(id) {
}

var tilesize = 400;
var magsize = 500;

function hideMagnifier() {
	$("#magnifier").hide();
}

function showMagnifier(img,mousepos) {
	var magnifier = $("#magnifier");
	var children = $(magnifier).children();
	children.remove();
	var pos = {left: mousepos.x - magsize/2, top: mousepos.y - magsize/2};
	
    var imgpos = $(img).offset();
	var nsize = {width: $(img).width(), height: $(img).height()};
	var lsize = largesize(img);

	var lpos = { x: (mousepos.x - imgpos.left) * lsize.width / nsize.width,
				 y: (mousepos.y - imgpos.top) * lsize.height / nsize.height };

	var tiles = tilesAround(img,lpos,magsize);
	
	var tile;
	for(var i=0; i<tiles.length; i++) {
        tile = tiles[i];
        var t = $("<img />");
        t.css("position","absolute");
        t.css("left",tile.left);
        t.css("top",tile.top);
        t.css("width", tile.width);
        t.css("height", tile.height);
        t.attr("src",tile.url);
        magnifier.append(t);
	}
	magnifier.css("position", "absolute");
	magnifier.css("left", pos.left);
    magnifier.css("top", pos.top);
	
	magnifier.css("display","block");
	magnifier.show();
}

function tilesAround(img,lpos,magsize) {
	var upperLeft = {x: Math.round(lpos.x - magsize / 2), y: Math.round(lpos.y - magsize / 2)};
	var lowerRight = {x: lpos.x + magsize / 2, y: lpos.y + magsize / 2};
	var lsize = largesize(img);
	var tiles=[];
        
    var upperLeftTile = {
        x: Math.floor(upperLeft.x / tilesize), 
        y: Math.floor(upperLeft.y / tilesize)
    }

    var lowerRightTile = {
        x: Math.floor(lowerRight.x / tilesize), 
        y: Math.floor(lowerRight.y / tilesize)
    }
    
    for(var tiy = upperLeftTile.y; tiy <= lowerRightTile.y; tiy++) {
        for(var tix = upperLeftTile.x; tix <= lowerRightTile.x; tix++) {
            if (tix < 0 || tiy < 0) continue;
            if (tix > lowerRightTile.x || tiy > lowerRightTile.y) continue;
            
            var left = tix * tilesize - upperLeft.x;
            var top = tiy * tilesize - upperLeft.y;
            
            var tileName = (tix * tilesize)+","+(tiy * tilesize);
            var width = Math.min(lsize.width - tix * tilesize,tilesize);
            var height = Math.min(lsize.height - tiy * tilesize,tilesize);
            var url = "images/tiles/"+tileName+"/"+basename($(img).attr('src'));
			tiles.push({left: left, top: top, url: url, width: width, height: height});
        }
    }
	return tiles;
}

function basename(url) {
    return url.replace(/images\/[^/]+\//,"");
}

function tile(img,x,y) {
		
}

function largesize(img) {
	return {width: 2480, height: 3248 };
}

function normalsize(img) {
	return {width: 595, height: 779 };
}

function smallsize(img) {
	return {width: 124, height: 162 };
}


function loadImages() {
	var scrobber = $('#scrobber');
	scrobber.empty();
	for(var i=0; i<images.length; i++) {
		var basename = images[i];
		var smallurl = "images/small/"+basename;
		var img = $("<img />");
		img.attr('src',smallurl);
		img.attr('class', i % 2 == 0 ? 'leftthumb' : 'rightthumb');
		scrobber.append(img);
	}
}

function indexOfImg(img) {
    return images.indexOf(basename(img.attr('src')));
}

function normalUrl(name) {
    return "" != name ? "images/normal/"+name : "";
}

function nextSpread() {
    var imgIdx = indexOfImg($('#leftimg'));
    var nextImgIdx = imgIdx + 2;
    var leftIdx = nextImgIdx;
    if (leftIdx >= images.length) leftIdx = 0;
    var rightIdx = leftIdx + 1;
    var leftName = images[leftIdx];
    var rightName = rightIdx < images.length ? images[rightIdx] : "";
    $('#leftimg').attr('src', normalUrl(leftName));
    $('#rightimg').attr('src', normalUrl(rightName));
}

function loaded() {
	$("html").keypress(function(event){ document.title = "code: "+event.value; });
	$('.magnifier').click(function(event) {
		hideMagnifier();
  	});
  	$('.leftpage,.rightpage').click(function(event) {
		showMagnifier(event.target,{x: event.pageX, y: event.pageY});
  	});
  	
  	$('.leftpage,.rightpage').dblclick(function(event) {
  		nextSpread();
	});
	
	$('.leftpage,.rightpage').swipe({
	     swipeLeft: function() { nextSpread(); },
	     swipeRight: function() { nextSpread(); },
	});
	hideMagnifier();
}



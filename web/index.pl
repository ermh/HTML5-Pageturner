#!/usr/bin/perl -w

($lw,$lh) = (2569,3248);
$l2n = 72/300;
($nw,$nh) = (int($lw*$l2n),int($lh*$l2n));
$tilesize=400;

@images = ("S001CO103.jpg",
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
			"S022CO103.jpg",
			"S023CO103.jpg");

open(IMGLIST,">images.js");
print IMGLIST "var images = [\n";
for($i=0; $i<$#images; $i++) {
	$largeurl = "images/large/$images[$i]";
	$normalurl = "images/normal/$images[$i]";
	print IMGLIST "{large: {url: $largeurl, width: $lw, height: $lh}, normal: {url: $normalurl, width: $nw, height: $nh},\n";
}
print IMGLIST "];\n";
close(IMGLIST);


if (0) {

system("mkdir -p images/large");
system("mkdir -p images/normal");

for($i=0; $i<$#images; $i++) {
	$cmd = "convert -filter Quadratic -resize ${nw}x${nh} images/large/$images[$i] images/normal/$images[$i]";
	print STDERR "$cmd\n";
	system($cmd);
	print STDERR "DONE\n";
	for($dx=0; $dx<$lw; $dx+=${tilesize}) {
		for($dy=0; $dy<$lh; $dy+=${tilesize}) {
			$dx2 = $dx+${tilesize} < $lw ? $dx+${tilesize} : $lw;
			$dy2 = $dy+${tilesize} < $lh ? $dy+${tilesize} : $lh;
			$w = $dx2-$dx;
			$h = $dy2-$dy;
			$cmd = "mkdir -p images/tiles/${dx},${dy}";
			# print STDERR "$cmd\n";
			system($cmd);
			$cmd = "convert -crop ${w}x${h}+${dx}+${dy} -quality 50 images/large/$images[$i] images/tiles/${dx},${dy}/$images[$i]";
			print STDERR "$cmd\n";
			system($cmd);
		}
	}
}
}
			
print <<END;
<html>
<link rel="stylesheet" type="text/css" href="style.css" />
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
<script src="script.js"></script>
END
print <<END;
<body onload="loaded()">
<div class="magnifier" id="magnifier"></div>
END
for($i=0; $i<$#images; $i++) {
	print <<END;
	<img id="img$i" src="images/normal/$images[$i]?test" class="page" />
END
}
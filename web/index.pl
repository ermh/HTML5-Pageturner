#!/usr/bin/perl -w

$l2n = 72/300;
$l2s = 15/300;

($lw,$lh) = (2480,3248);
($nw,$nh) = (int($lw*$l2n),int($lh*$l2n));
($sw,$sh) = (int($lw*$l2s),int($lh*$l2s));

print "large:  $lw,$lh\n";
print "normal: $nw,$nh\n";
print "small:  $sw,$sh\n";

$tilesize=400;

@images = (
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



open(APPCACHE,">test.appcache");

system("mkdir -p images/large");
system("mkdir -p images/normal");
system("mkdir -p images/small");

print APPCACHE <<END;
CACHE MANIFEST

NETWORK:
*

CACHE:
http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
index.html
script.js
style.css
END

$gentiles = 1;
$gensmall = 0;
$gennormal = 0;

for($i=0; $i<$#images; $i++) {
    # Normal
    if ($gennormal) {
        $cmd = "convert -filter Quadratic -resize ${nw}x${nh} images/large/$images[$i] images/normal/$images[$i]";
	print STDERR "generate normal size (72dpi) $cmd\n";
	system($cmd);
	print STDERR "DONE\n";
	print APPCACHE "images/normal/$images[$i]\n";
    }
    
    
    # Small
    if ($gensmall) {
	$cmd = "convert -filter Quadratic -resize ${sw}x${sh} images/large/$images[$i] images/small/$images[$i]";
	print STDERR "generate small size (12dpi) $cmd\n";
	system($cmd);
	print STDERR "DONE\n";
	print APPCACHE "images/small/$images[$i]\n";
    }
    
    # Tiles
    if ($gentiles) {
	for($dx=0; $dx<$lw; $dx+=${tilesize}) {
		for($dy=0; $dy<$lh; $dy+=${tilesize}) {
			$dx2 = $dx+${tilesize} < $lw ? $dx+${tilesize} : $lw;
			$dy2 = $dy+${tilesize} < $lh ? $dy+${tilesize} : $lh;
			
			$w = $dx2-$dx;
			$h = $dy2-$dy;

			$cmd = "mkdir -p images/tiles/${dx},${dy}";
			system($cmd);
			
			$cmd = "convert -crop ${w}x${h}+${dx}+${dy} -quality 50 images/large/$images[$i] images/tiles/${dx},${dy}/$images[$i]";
			print STDERR "$cmd\n";
			system($cmd);

			print APPCACHE "images/tiles/${dx},${dy}/$images[$i]\n";
		}
	}
    }
}
close(APPCACHE);

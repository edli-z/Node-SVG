const ClipperLib = require("./clipper")

const svgToClipper = function(polygon, clipperScale){
	var clip = [];

	for(var i=0; i<polygon.length; i++){
		clip.push({X: polygon[i].x, Y: polygon[i].y});
	}
	
	ClipperLib.JS.ScaleUpPath(clip, clipperScale);
	
	return clip;
}

module.exports = svgToClipper


const ClipperLib = require("./clipper")
const svgToClipper = require("./svgToClipper")
const clipperToSvg = require("./clipperToSvg")

const cleanPolygon = function(polygon, clipperScale, curveTolerance){

	var p = svgToClipper(polygon, clipperScale);
	// remove self-intersections and find the biggest polygon that's left
	var simple = ClipperLib.Clipper.SimplifyPolygon(p, ClipperLib.PolyFillType.pftNonZero);
	
	if(!simple || simple.length == 0){
		return null;
	}
	
	var biggest = simple[0];
	var biggestarea = Math.abs(ClipperLib.Clipper.Area(biggest));
	for(var i=1; i<simple.length; i++){
		var area = Math.abs(ClipperLib.Clipper.Area(simple[i]));
		if(area > biggestarea){
			biggest = simple[i];
			biggestarea = area;
		}
	}

	// clean up singularities, coincident points and edges
	var clean = ClipperLib.Clipper.CleanPolygon(biggest, curveTolerance*clipperScale);
				
	if(!clean || clean.length == 0){
		return null;
	}
				
	return clipperToSvg(clean, clipperScale);
}

module.exports = cleanPolygon

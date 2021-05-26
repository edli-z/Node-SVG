
const clipperToSvg = function(polygon, clipperScale){
	var normal = [];
	
	for(var i=0; i<polygon.length; i++){
		normal.push({
			x: polygon[i].X/clipperScale, 
			y: polygon[i].Y/clipperScale
		});
	}
	
	return normal;
}

module.exports = clipperToSvg

const { rotatePolygon } = require("./placementworker")
const GeometryUtil = require("./geometryutil")
const ClipperLib = require("./clipper")

function toClipperCoordinates(polygon){
	var clone = [];
	for(var i=0; i<polygon.length; i++){
		clone.push({
			X: polygon[i].x,
			Y: polygon[i].y
		});
	}

	return clone;
};
	
function toNestCoordinates(polygon, scale){
	var clone = [];
	for(var i=0; i<polygon.length; i++){
		clone.push({
			x: polygon[i].X/scale,
			y: polygon[i].Y/scale
		});
	}

	return clone;
};

function minkowskiDifference(A, B){
	var Ac = toClipperCoordinates(A);
	ClipperLib.JS.ScaleUpPath(Ac, 10000000);
	var Bc = toClipperCoordinates(B);
	ClipperLib.JS.ScaleUpPath(Bc, 10000000);
	for(var i=0; i<Bc.length; i++){
		Bc[i].X *= -1;
		Bc[i].Y *= -1;
	}
	var solution = ClipperLib.Clipper.MinkowskiSum(Ac, Bc, true);
	var clipperNfp;

	var largestArea = null;
	for(i=0; i<solution.length; i++){
		var n = toNestCoordinates(solution[i], 10000000);
		var sarea = GeometryUtil.polygonArea(n);
		if(largestArea === null || largestArea > sarea){
			clipperNfp = n;
			largestArea = sarea;
		}
	}

	for(var i=0; i<clipperNfp.length; i++){
		clipperNfp[i].x += B[0].x;
		clipperNfp[i].y += B[0].y;
	}

	return [clipperNfp];
}

function processNfpPair(pair, { searchEdges, useHoles }){

	if(!pair || pair.length == 0){
		return null;
	}
	
	var A = rotatePolygon(pair.A, pair.key.Arotation);
	var B = rotatePolygon(pair.B, pair.key.Brotation);

	var nfp;
	
	if(pair.key.inside){
		if(GeometryUtil.isRectangle(A, 0.001)){
			nfp = GeometryUtil.noFitPolygonRectangle(A,B);
		}
		else{
			nfp = GeometryUtil.noFitPolygon(A,B,true,searchEdges);
		}
		
		// ensure all interior NFPs have the same winding direction
		if(nfp && nfp.length > 0){
			for(var i=0; i<nfp.length; i++){
				if(GeometryUtil.polygonArea(nfp[i]) > 0){
					nfp[i].reverse();
				}
			}
		}
		else{
			// warning on null inner NFP
			// this is not an error, as the part may simply be larger than the bin or otherwise unplaceable due to geometry
			log('NFP Warning: ', pair.key);
		}
	}
	else{
		if(searchEdges){
			nfp = GeometryUtil.noFitPolygon(A,B,false,searchEdges);
		}
		else{
			nfp = minkowskiDifference(A,B);
		}
		// sanity check
		if(!nfp || nfp.length == 0){
			log('NFP Error: ', pair.key);
			log('A: ',JSON.stringify(A));
			log('B: ',JSON.stringify(B));
			return null;
		}
		
		for(var i=0; i<nfp.length; i++){
			if(!searchEdges || i==0){ // if searchedges is active, only the first NFP is guaranteed to pass sanity check
				if(Math.abs(GeometryUtil.polygonArea(nfp[i])) < Math.abs(GeometryUtil.polygonArea(A))){
					log('NFP Area Error: ', Math.abs(GeometryUtil.polygonArea(nfp[i])), pair.key);
					log('NFP:', JSON.stringify(nfp[i]));
					log('A: ',JSON.stringify(A));
					log('B: ',JSON.stringify(B));
					nfp.splice(i,1);
					return null;
				}
			}
		}
		
		if(nfp.length == 0){
			return null;
		}
		
		// for outer NFPs, the first is guaranteed to be the largest. Any subsequent NFPs that lie inside the first are holes
		for(var i=0; i<nfp.length; i++){
			if(GeometryUtil.polygonArea(nfp[i]) > 0){
				nfp[i].reverse();
			}
			
			if(i > 0){
				if(GeometryUtil.pointInPolygon(nfp[i][0], nfp[0])){
					if(GeometryUtil.polygonArea(nfp[i]) < 0){
						nfp[i].reverse();
					}
				}
			}
		}
		
		// generate nfps for children (holes of parts) if any exist
		if(useHoles && A.children() && A.children().length > 0){
			var Bbounds = GeometryUtil.getPolygonBounds(B);
			
			for(var i=0; i<A.children().length; i++){
				var Abounds = GeometryUtil.getPolygonBounds(A.children()[i]);

				// no need to find nfp if B's bounding box is too big
				if(Abounds.width > Bbounds.width && Abounds.height > Bbounds.height){
				
					var cnfp = GeometryUtil.noFitPolygon(A.children()[i],B,true,searchEdges);
					// ensure all interior NFPs have the same winding direction
					if(cnfp && cnfp.length > 0){
						for(var j=0; j<cnfp.length; j++){
							if(GeometryUtil.polygonArea(cnfp[j]) < 0){
								cnfp[j].reverse();
							}
							nfp.push(cnfp[j]);
						}
					}
				
				}
			}
		}
	}
	
	function log(){
		if(typeof console !== "undefined") {
			console.log.apply(console,arguments);
		}
	}
	
	
	
	return { key: pair.key, value: nfp };

}

exports.processNfpPair = processNfpPair
exports.minkowskiDifference = minkowskiDifference

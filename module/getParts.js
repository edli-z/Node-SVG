const polygonify = require('./polygonify')
const cleanPolygon = require('./cleanPolygon')
const GeometryUtil = require("./geometryutil")

function getParts(paths, curveTolerance, toleranceSvg, clipperScale){
	var i, j;
	var polygons = [];
	
	var numChildren = paths.length;
	for(i=0; i<numChildren; i++){
		var poly = polygonify(paths[i], 2, toleranceSvg);//<--2 must not be hard coded, fault of the author, the polygonify of the browser uses the curveTolerance(== 2 here) internal to polygonify.

		poly = cleanPolygon(poly, clipperScale, curveTolerance);
		
		// todo: warn user if poly could not be processed and is excluded from the nest
		if(poly && poly.length > 2 && Math.abs(GeometryUtil.polygonArea(poly)) > curveTolerance*curveTolerance){
			poly.source = i;					
			polygons.push(poly);
		}
	}
				
	// turn the list into a tree
	toTree(polygons);
	
	function toTree(list, idstart){
		var parents = [];
		var i,j;
		
		// assign a unique id to each leaf
		var id = idstart || 0;
		
		for(i=0; i<list.length; i++){
			var p = list[i];
			
			var ischild = false;
			for(j=0; j<list.length; j++){
				if(j==i){
					continue;
				}
				if(GeometryUtil.pointInPolygon(p[0], list[j]) === true){
					if(!list[j].children){
						list[j].children = [];
					}
					list[j].children.push(p);
					p.parent = list[j];
					ischild = true;
					break;
				}
			}
			
			if(!ischild){
				parents.push(p);
			}
		}
		
		for(i=0; i<list.length; i++){
			if(parents.indexOf(list[i]) < 0){
				list.splice(i, 1);
				i--;
			}
		}
		
		for(i=0; i<parents.length; i++){
			parents[i].id = id;
			id++;
		}
		
		for(i=0; i<parents.length; i++){
			if(parents[i].children){
				id = toTree(parents[i].children, id);
			}
		}
						
		return id;
	};
	
	return polygons;
};

module.exports = getParts

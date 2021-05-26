const { encodeSVGPath, SVGPathData } = require("svg-pathdata")
const MLHVCSQTA_test = require("./utils/MLHVCSQTA_test")
const cloneDeep = require('lodash/cloneDeep')

// split a compound path (paths with M, m commands) into an array of paths
function splitPath(path){

	if(!path || path.type != 'path' || !path.parent()){
		return false;
	}

	var pathData = path.attr('d')

	var svgPathData = new SVGPathData(pathData)
	
	/*
	var seglist = [];
	
	// make copy of seglist (appending to new path removes it from the original pathseglist)
	for(var i=0; i < path.pathSegList.numberOfItems; i++){
			seglist.push(path.pathSegList.getItem(i));
	}
	*/

	var x=0, y=0, x0=0, y0=0;
	var paths = [];
	
	var p;
	
	var lastM = 0;

	for(var i = svgPathData.commands.length-1; i >= 0; i--){
		if(i > 0 && svgPathData.commands[i].type == SVGPathData.MOVE_TO){
			lastM = i;
			break;
		}
	}
	
	if(lastM == 0){
		return false; // only 1 M command, no need to split
	}
	
	for(var i=0; i < svgPathData.commands.length; i++){
		var s = svgPathData.commands[i];
		var command = s.type;

		if(command == SVGPathData.MOVE_TO){

			p = cloneDeep(path);
			p.attr('d','');

			paths.push(p);
		}

		const pData = p.attr('d');
		const svgPData = new SVGPathData(pData)
		
		if (MLHVCSQTA_test(s)){

			if('x' in s) x=s.x;
			if('y' in s) y=s.y;

			svgPData.commands.push(s);

			p.attr('d', encodeSVGPath(svgPData.commands))

		} else {
			if ('x'  in s) x+=s.x;
			if ('y'  in s) y+=s.y;

			if(command == SVGPathData.MOVE_TO && s.relative === true){

				//p.pathSegList.appendItem(path.createSVGPathSegMovetoAbs(x,y));
				svgPData.commands.push({
					type: SVGPathData.MOVE_TO, relative: false,  x,  y
				})

				p.attr('d', encodeSVGPath(svgPData.commands))

			} else {

				if(command == SVGPathData.CLOSE_PATH){
					x = x0;
					y = y0;
				}

				//p.pathSegList.appendItem(s);

				svgPData.commands.push(s)
				p.attr('d', encodeSVGPath(svgPData.commands))

			}
		}
		// Record the start of a subpath
		if (command == SVGPathData.MOVE_TO){
			x0=x, y0=y;
		}
	}
	
	var addedPaths = [];
	for(i=0; i<paths.length; i++){
		// don't add trivial paths from sequential M commands
		
		var pathData = paths[i].attr('d')
		var svgPathData = new SVGPathData(pathData)

		if(svgPathData.commands.length > 1){
			paths[i].insertBefore(path)
			addedPaths.push(paths[i]);
		}

	}
	
	path.remove();

	return addedPaths;

}

module.exports = splitPath

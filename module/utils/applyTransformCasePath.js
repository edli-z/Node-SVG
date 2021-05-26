const Matrix = require('../matrix')
const { SVGPathData } = require('svg-pathdata')

function applyTransformCasePath(pathData, matrix){
	var transform, scale, rotate;

	transform = new Matrix()

	transform.matrix(matrix)

	var tarray = transform.toArray()

	rotate = Math.atan2(tarray[1], tarray[3])*180/Math.PI;
	scale = Math.sqrt(tarray[0]*tarray[0]+tarray[2]*tarray[2]);

	//var seglist = element.pathSegList;
	var svgPathData = new SVGPathData(pathData) 
	var prevx = 0;
	var prevy = 0;

	let transformedPath = '';

	for(var i=0; i < svgPathData.commands.length; i++){

		var s = svgPathData.commands[i];

		var command = s.type;
		
		if(command == SVGPathData.HORIZ_LINE_TO && !s.relative){
			//seglist.replaceItem(element.createSVGPathSegLinetoAbs(s.x,prevy),i);
			svgPathData.commands[i] = {
				type: SVGPathData.LINE_TO, 
				relative: false, 
				x: s.x, 
				y: prevy
			}
			s = svgPathData.commands[i];	
		}
		else if(command == SVGPathData.VERT_LINE_TO && !s.relative){
			//seglist.replaceItem(element.createSVGPathSegLinetoAbs(prevx,s.y),i);
			svgPathData.commands[i] = {
				type: SVGPathData.LINE_TO, 
				relative: false, 
				x: prevx, 
				y: s.y
			}
			s = svgPathData.commands[i];
		}
		// currently only works for uniform scale, no skew
		// todo: fully support arbitrary affine transforms...
		else if(command == SVGPathData.ARC && !s.relative){
			//seglist.replaceItem(element.createSVGPathSegArcAbs(s.x,s.y,s.r1*scale,s.r2*scale,s.angle+rotate,s.largeArcFlag,s.sweepFlag),i);
			svgPathData.commands[i] = {
				type: SVGPathData.ARC,
				x: s.x,
				y: s.y,
				rX: s.rX * scale,
				rY: s.rY * scale,
				xRot: s.xRot + rotate,
				lArcFlag: s.lArcFlag,
				sweepFlag: s.sweepFlag
			}
			s = svgPathData.commands[i];
		}

		const transPoints = {};
		
		if('x' in s && 'y' in s){
			var transformed = transform.calc(s.x, s.y);
			prevx = s.x;
			prevy = s.y;
			transPoints.x = transformed[0];
			transPoints.y = transformed[1];
		}
		if('x1' in s && 'y1' in s){
			var transformed = transform.calc(s.x1, s.y1);
			transPoints.x1 = transformed[0];
			transPoints.y1 = transformed[1];
		}
		if('x2' in s && 'y2' in s){
			var transformed = transform.calc(s.x2, s.y2);
			transPoints.x2 = transformed[0];
			transPoints.y2 = transformed[1];
		}

		let commandStringTransformed = ``;

		//MLHVCSQTA
		//H and V are transformed to "L" commands above so we don't need to handle them. All lowercase (relative) are already handled too (converted to absolute)
		switch(command) {
			case SVGPathData.MOVE_TO:
				commandStringTransformed += `M ${transPoints.x} ${transPoints.y}`;
				break;
			case SVGPathData.LINE_TO:
				commandStringTransformed += `L ${transPoints.x} ${transPoints.y}`;
				break;
			case SVGPathData.CURVE_TO: 
				commandStringTransformed += `C ${transPoints.x1} ${transPoints.y1}  ${transPoints.x2} ${transPoints.y2} ${transPoints.x} ${transPoints.y}`;
				break;
			case SVGPathData.SMOOTH_CURVE_TO: 
				commandStringTransformed += `S ${transPoints.x2} ${transPoints.y2} ${transPoints.x} ${transPoints.y}`;
				break;
			case SVGPathData.QUAD_TO:
				commandStringTransformed += `Q ${transPoints.x1} ${transPoints.y1} ${transPoints.x} ${transPoints.y}`;
				break;
			case SVGPathData.SMOOTH_QUAD_TO: 
				commandStringTransformed += `T ${transPoints.x} ${transPoints.y}`;
				break;
			case SVGPathData.ARC:
				const largeArcFlag = s.lArcFlag ? 1 : 0;
				const sweepFlag = s.sweepFlag ? 1 : 0;
				commandStringTransformed += `A ${s.rX} ${s.rY} ${s.xRot} ${largeArcFlag} ${sweepFlag} ${transPoints.x} ${transPoints.y}`
				break;
			case SVGPathData.HORIZ_LINE_TO:
				commandStringTransformed += `L ${transPoints.x} ${transPoints.y}`
				break;
			case SVGPathData.VERT_LINE_TO:
				commandStringTransformed += `L ${transPoints.x} ${transPoints.y}`
				break;
			case SVGPathData.CLOSE_PATH: 
				commandStringTransformed += s.relative ? 'z' : 'Z';
				break;
			default: 
				console.log('FOUND COMMAND NOT HANDLED BY COMMAND STRING BUILDER', command);
				break;
		}

		transformedPath += commandStringTransformed;
	}

	return transformedPath
}

module.exports = applyTransformCasePath

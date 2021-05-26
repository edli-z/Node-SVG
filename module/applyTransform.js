const Matrix = require('./matrix')
const transformParse = require('./transformParse')
const { SVG } = require('@svgdotjs/svg.js')
const getPoints = require("./utils/getPoints")
const pathToAbsolute = require("./pathToAbsolute")
const applyTransformCasePath = require("./utils/applyTransformCasePath")
const { encodeSVGPath, SVGPathData } = require("svg-pathdata")
const cloneDeep = require('lodash/cloneDeep')

function applyTransform(_element, globalTransform){
	var element = cloneDeep(_element)
	
	globalTransform = globalTransform || '';

	var transformString = element.attr('transform') || '';
	transformString = globalTransform + transformString;
	
	var transform, scale, rotate;

	if(transformString && transformString.length > 0){
		var transform = transformParse(transformString);
	}

	if(!transform){
		transform = new Matrix();
	}
	
	var tarray = transform.toArray();
	
	// decompose affine matrix to rotate, scale components (translate is just the 3rd column)
	var rotate = Math.atan2(tarray[1], tarray[3])*180/Math.PI;
	var scale = Math.sqrt(tarray[0]*tarray[0]+tarray[2]*tarray[2]);

	if(element.type == 'g' || element.type == 'svg' || element.type == 'defs' || element.type == 'clipPath'){
		//element.removeAttribute('transform');
		element.attr('transform', null);

		var children = Array.prototype.slice.call(element.children());

		for(var i=0; i< children.length; i++){
			if(children[i].type){ // skip text nodes
				var newChild = applyTransform(children[i], transformString);
				if(children[i].parent()){
					children[i].replace(newChild)
				}
			}
		}
	}
	else if(transform && !transform.isIdentity()){
		const id = element.attr('id')
		const className = element.attr('class')

		switch(element.type){
			case 'ellipse':
				// the goal is to remove the transform property, but an ellipse without a transform will have no rotation
				// for the sake of simplicity, we will replace the ellipse with a path, and apply the transform to that path
				/*
				var path = this.svg.createElementNS(element.namespaceURI, 'path');
				var move = path.createSVGPathSegMovetoAbs(parseFloat(element.attr('cx'))-parseFloat(element.attr('rx')),element.attr('cy'));
				var arc1 = path.createSVGPathSegArcAbs(parseFloat(element.attr('cx'))+parseFloat(element.attr('rx')),element.attr('cy'),element.attr('rx'),element.attr('ry'),0,1,0);
				var arc2 = path.createSVGPathSegArcAbs(parseFloat(element.attr('cx'))-parseFloat(element.attr('rx')),element.attr('cy'),element.attr('rx'),element.attr('ry'),0,1,0);
				*/
				var path = SVG('<path/>');

				const d = encodeSVGPath([
					{ 
						type: SVGPathData.MOVE_TO, 
						relative: false, 
						x: parseFloat(element.attr('cx')) - parseFloat(element.attr('rx')), 
						y: parseFloat(element.attr('cy')) 
					},
					{ 
						type: SVGPathData.ARC, 
						relative: false,  
						x: parseFloat(element.attr('cx')) + parseFloat(element.attr('rx')), 
						y: parseFloat(element.attr('cy')),
						rX: parseFloat(element.attr('rx')),
						rY: parseFloat(element.attr('ry')),
						xRot: 0,	
						lArcFlag: 1,
						sweepFlag: 0
					},
					{ 
						type: SVGPathData.ARC, 
						relative: false,  
						x: parseFloat(element.attr('cx')) - parseFloat(element.attr('rx')), 
						y: parseFloat(element.attr('cy')),
						rX: parseFloat(element.attr('rx')),
						rY: parseFloat(element.attr('ry')),
						xRot: 0,	
						lArcFlag: 1,
						sweepFlag: 0
					},
					{ type: SVGPathData.CLOSE_PATH }
				])

				path.attr('d', d)
				
				var transformProperty = element.attr('transform');

				if(transformProperty){
					path.attr('transform', transformProperty);
				}
				
				//element.parentElement.replaceChild(path, element);
				element.replace(path);

				element = path;

			case 'path':
				var newElement = pathToAbsolute(element)
				element.replace(newElement)
				element = newElement

				let transformedPath = applyTransformCasePath(element.attr('d'), transform.toArray());
				
				element.attr('d', transformedPath);
				element.attr('transform', null);
			break;
			case 'circle':
				var transformed = transform.calc(element.attr('cx'), element.attr('cy'));
				element.attr('cx', transformed[0]);
				element.attr('cy', transformed[1]);
				
				// skew not supported
				element.attr('r', element.attr('r')*scale);
			break;
			case 'line':
				const transformedStartPt = transform.calc(element.attr('x1'), element.attr('y1'));
				const transformedEndPt = transform.calc(element.attr('x2'), element.attr('y2'));
				element.attr('x1', transformedStartPt[0].toString());
				element.attr('y1', transformedStartPt[1].toString());
				element.attr('x2', transformedEndPt[0].toString());
				element.attr('y2', transformedEndPt[1].toString());
			break;
			case 'rect':
				// similar to the ellipse, we'll replace rect with polygon
				//var polygon = this.svg.createElementNS(element.namespaceURI, 'polygon');
				var polygon = SVG('<polygon></polygon>');
														
				//var p1 = this.svgRoot.createSVGPoint();
				var p1 = {}
				//var p2 = this.svgRoot.createSVGPoint();
				var p2 = {}
				//var p3 = this.svgRoot.createSVGPoint();
				var p3 = {}
				//var p4 = this.svgRoot.createSVGPoint();
				var p4 = {}
				
				p1.x = parseFloat(element.attr('x')) || 0;
				p1.y = parseFloat(element.attr('y')) || 0;
				
				p2.x = p1.x + parseFloat(element.attr('width'));
				p2.y = p1.y;
				
				p3.x = p2.x;
				p3.y = p1.y + parseFloat(element.attr('height'));
				
				p4.x = p1.x;
				p4.y = p3.y;
				
				/*
				polygon.points.appendItem(p1);
				polygon.points.appendItem(p2);
				polygon.points.appendItem(p3);
				polygon.points.appendItem(p4);
				*/

				polygon.plot([
					[p1.x, p1.y], 
					[p2.x, p2.y], 
					[p3.x, p3.y], 
					[p4.x, p4.y] 
				])
				
				var transformProperty = element.attr('transform');
				if(transformProperty){
					polygon.attr('transform', transformProperty);
				}
				
				//element.parentElement.replaceChild(polygon, element);
				element.replace(polygon)

				element = polygon;
			case 'polygon':
			case 'polyline':
				let transformedPoly = ''

				let points = getPoints(element)
				for(var i=0; i < points.length; i++){
					var point = points[i];
					var transformed = transform.calc(point.x, point.y);
					const pointPairString = `${transformed[0]},${transformed[1]} `;
					transformedPoly += pointPairString;
				}
				
				//element.setAttribute('points', transformedPoly);
				element.attr('points', transformedPoly);
				//element.removeAttribute('transform');
				element.attr('transform', null);
			break;
		}
		if(id) {
			element.attr('id', id);
		}
		if(className){
			element.attr('class', className);
		}
	}

	return element
}

module.exports = applyTransform 


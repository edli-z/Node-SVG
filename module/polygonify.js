const GeometryUtil = require("./geometryutil")
const getPoints = require("./utils/getPoints")
const svgPathParser = require("svg-path-parser")

//return a polygon from the given SVG element in the form of an array of points
function polygonify(element, tolerance, toleranceSvg){
		var poly = [];
		var i;

		switch(element.type){
			case 'polygon':
			case 'polyline':
				{
					let points = getPoints(element)
					for(let i = 0; i < points.length; i++){
						var point = points[i];
						poly.push({ x: point.x, y: point.y });
					}
				}
			break;
			case 'rect':
				var p1 = {};
				var p2 = {};
				var p3 = {};
				var p4 = {};
				
				p1.x = parseFloat(element.attr('x')) || 0;
				p1.y = parseFloat(element.attr('y')) || 0;
				
				p2.x = p1.x + parseFloat(element.attr('width'));
				p2.y = p1.y;
				
				p3.x = p2.x;
				p3.y = p1.y + parseFloat(element.attr('height'));
				
				p4.x = p1.x;
				p4.y = p3.y;
				
				poly.push(p1);
				poly.push(p2);
				poly.push(p3);
				poly.push(p4);
			break;
			case 'circle':				
				var radius = parseFloat(element.attr('r'));
				var cx = parseFloat(element.attr('cx'));
				var cy = parseFloat(element.attr('cy'));
				
				// num is the smallest number of segments required to approximate the circle to the given tolerance
				var num = Math.ceil((2*Math.PI)/Math.acos(1 - (tolerance/radius)));
				
				if(num < 3){
					num = 3;
				}
				
				for(var i=0; i<num; i++){
					var theta = i * ( (2*Math.PI) / num);
					var point = {};
					point.x = radius*Math.cos(theta) + cx;
					point.y = radius*Math.sin(theta) + cy;
					
					poly.push(point);
				}
			break;
			case 'ellipse':				
				// same as circle case. There is probably a way to reduce points but for convenience we will just flatten the equivalent circular polygon
				var rx = parseFloat(element.attr('rx'))
				var ry = parseFloat(element.attr('ry'));
				var maxradius = Math.max(rx, ry);
				
				var cx = parseFloat(element.attr('cx'));
				var cy = parseFloat(element.attr('cy'));
				
				var num = Math.ceil((2*Math.PI)/Math.acos(1 - (tolerance/maxradius)));
				
				if(num < 3){
					num = 3;
				}
				
				for(var i=0; i<num; i++){
					var theta = i * ( (2*Math.PI) / num);
					var point = {};
					point.x = rx*Math.cos(theta) + cx;
					point.y = ry*Math.sin(theta) + cy;
					
					poly.push(point);
				}
			break;
			case 'path':
				// we'll assume that splitpath has already been run on this path, and it only has one M/m command 
				//var seglist = element.pathSegList;

				const pathD = element.attr('d')
				const parsedPathD = svgPathParser(pathD) 

				//var firstCommand = seglist.getItem(0);
				var firstCommand = parsedPathD[0]

				//var lastCommand = seglist.getItem(seglist.numberOfItems-1);
				var lastCommand = parsedPathD[parsedPathD.length - 1]

				var x=0, y=0, x0=0, y0=0, x1=0, y1=0, x2=0, y2=0, prevx=0, prevy=0, prevx1=0, prevy1=0, prevx2=0, prevy2=0;
				
				for(var i=0; i < parsedPathD.length/*seglist.numberOfItems*/; i++){
					//var s = seglist.getItem(i);
					var s = parsedPathD[i]

					//var command = s.pathSegTypeAsLetter;
					var command = s.code
					
					prevx = x;
					prevy = y;
					
					prevx1 = x1;
					prevy1 = y1;
					
					prevx2 = x2;
					prevy2 = y2;
					
					if (/[MLHVCSQTA]/.test(command)){
						if ('x1' in s) x1=s.x1;
						if ('x2' in s) x2=s.x2;
						if ('y1' in s) y1=s.y1;
						if ('y2' in s) y2=s.y2;
						if ('x' in s) x=s.x;
						if ('y' in s) y=s.y;
					}
					else{
						if ('x1' in s) x1=x+s.x1;
						if ('x2' in s) x2=x+s.x2;
						if ('y1' in s) y1=y+s.y1;
						if ('y2' in s) y2=y+s.y2;							
						if ('x'  in s) x+=s.x;
						if ('y'  in s) y+=s.y;
					}
					switch(command){
						// linear line types
						case 'm':
						case 'M':
						case 'l':
						case 'L':
						case 'h':
						case 'H':
						case 'v':
						case 'V':
							var point = {};
							point.x = x;
							point.y = y;
							poly.push(point);
						break;
						// Quadratic Beziers
						case 't':
						case 'T':
						// implicit control point
						if(i > 0 && /[QqTt]/.test(parsedPathD[i-1].code)){
							x1 = prevx + (prevx-prevx1);
							y1 = prevy + (prevy-prevy1);
						}
						else{
							x1 = prevx;
							y1 = prevy;
						}
						case 'q':
						case 'Q':
							var pointlist = GeometryUtil.QuadraticBezier.linearize({x: prevx, y: prevy}, {x: x, y: y}, {x: x1, y: y1}, tolerance);
							pointlist.shift(); // firstpoint would already be in the poly
							for(var j=0; j<pointlist.length; j++){
								var point = {};
								point.x = pointlist[j].x;
								point.y = pointlist[j].y;
								poly.push(point);
							}
						break;
						case 's':
						case 'S':
							if(i > 0 && /[CcSs]/.test(parsedPathD[i-1].code)){
								x1 = prevx + (prevx-prevx2);
								y1 = prevy + (prevy-prevy2);
							}
							else{
								x1 = prevx;
								y1 = prevy;
							}
						case 'c':
						case 'C':
							var pointlist = GeometryUtil.CubicBezier.linearize({x: prevx, y: prevy}, {x: x, y: y}, {x: x1, y: y1}, {x: x2, y: y2}, tolerance);
							pointlist.shift(); // firstpoint would already be in the poly
							for(var j=0; j<pointlist.length; j++){
								var point = {};
								point.x = pointlist[j].x;
								point.y = pointlist[j].y;
								poly.push(point);
							}
						break;
						case 'a':
						case 'A':

							var pointlist = GeometryUtil.Arc.linearize({x: prevx, y: prevy}, {x: x, y: y}, s.rx, s.ry, s.xAxisRotation, s.largeArc,s.sweep, tolerance);
							pointlist.shift();
							
							for(var j=0; j<pointlist.length; j++){
								var point = {};
								point.x = pointlist[j].x;
								point.y = pointlist[j].y;
								poly.push(point);
							}
						break;
						case 'z': case 'Z': x=x0; y=y0; break;
					}
					// Record the start of a subpath
					if (command=='M' || command=='m') x0=x, y0=y;
				}
				
			break;
		}
		
		// do not include last point if coincident with starting point
		while(poly.length > 0 && GeometryUtil.almostEqual(poly[0].x,poly[poly.length-1].x, toleranceSvg) && GeometryUtil.almostEqual(poly[0].y,poly[poly.length-1].y, toleranceSvg)){
			poly.pop();
		}

		return poly;
}

module.exports = polygonify

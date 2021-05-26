// returns a window with a document and an svg root node
const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow } = require('@svgdotjs/svg.js')
const path = require("svg-path-properties");
const hull = require("hull.js")
const css = require('css')

function convert(svgStr){

	const window = createSVGWindow()
	const document = window.document
	 
	// register window and document
	registerWindow(window, document)
	 
	// create canvas
	const canvas = SVG(document.documentElement)
	let after_svg = SVG()
	let polygon_svg = SVG()
	let before_style = {}
	 
	// use svg.js as normal
	canvas.svg(svgStr)

	const vbx = canvas.get(0).attr('viewBox');
	let vbx_data = vbx.split(" ");
	let vbx_coord = [];
	for(v=0; v<vbx_data.length; v++) {
		vbx_coord[v] = parseFloat((Number(vbx_data[v])).toFixed(3));
	}

	//  Calculate new ViewBox
	let new_vbx = [0, 0];
	new_vbx[2] = parseFloat(((vbx_coord[2] - vbx_coord[0])*100).toFixed(3));
	new_vbx[3] = parseFloat(((vbx_coord[3] - vbx_coord[1])*100).toFixed(3));

	let points = [];
	let points_converted = [];
	let hull_pts = [];
	let output_path = '';

	//const d_data = canvas.get(0).get(1).get(0).attr('d');
	//const properties = new path.svgPathProperties(d_data);

	function _core(__Path){
		let pnt = __Path.attr('d');
		let pnt_splitted = pnt.split("M");
		let splitPath = [];


		if(pnt_splitted.length > 1) {
			for(i=1; i<pnt_splitted.length; i++) {
				splitPath[i-1] = "M" + pnt_splitted[i];
				let pathLength = new path.svgPathProperties(splitPath[i-1]).getTotalLength();
				let numPoints = pathLength / 0.01;
				if(pathLength < 0.01) {
					numPoints = 2;
				}
				let pathPoints = [];
				let after = 'M';

				for (let j=0; j<numPoints; j++) {
					let p = new path.svgPathProperties(splitPath[i-1]).getPointAtLength(j * pathLength / numPoints);
					pathPoints.push(p.x);
					pathPoints.push(p.y*(-1));
				}

				for(j=0; j<pathPoints.length; j++) {
					if(j != pathPoints.length-1) {
						if(j % 2 === 0) {
							after += ((pathPoints[j] - vbx_coord[0])*100).toFixed(1) + ",";
							points.push(((pathPoints[j] - vbx_coord[0])*100).toFixed(1));
						} else {
							after += ((pathPoints[j] - vbx_coord[1])*100).toFixed(1) + " L";
							points.push(((pathPoints[j] - vbx_coord[1])*100).toFixed(1));
						}
					} else {
						after += ((pathPoints[j] - vbx_coord[1])*100).toFixed(1);
						points.push(((pathPoints[j] - vbx_coord[1])*100).toFixed(1));
					}
				}

				after_svg.path(after);

				//---------------------------------------------------------------------------
				before_style = { 
					"stroke": __Path.attr("stroke")
				};

				if(__Path.attr("style")){

					let originalStyleAttr = "path {" + __Path.attr("style") + "}"

					let originalStyleAst = css.parse(originalStyleAttr)

					originalStyleAst.stylesheet.rules[0].declarations.forEach(function({
						property, value
					}){
						let source = {}
						source[property] = value
						Object.assign(
							before_style,
							source
						)
					})

				}
				//---------------------------------------------------------------------------
				
			}
		}
	}

	for(let x=0; x < canvas.get(0).children().length; x++){

		let __G = canvas.get(0).children()[x]

		switch(__G.type){

			case 'g':
				for(y=0; y < __G.children().length; y++) {

					let __Path = __G.children()[y]

					if(__Path.type === 'path'){

						_core(__Path)

					}

				}
				break

			case 'path':
				_core(__G)
				break

			default:

		}

	}


	// Preparing points for hull

	let points_key = 0;
	for(i=0; i<points.length; i++) {
		if(i % 2 === 0) {
			points_converted[points_key] = [];
			points_converted[points_key][0] = points[i];
		} else {
			points_converted[points_key][1] = points[i];
			points_key++;
		}
	}

	hull_pts = hull(points_converted, 50);

	after_svg.attr({
		fill: 'none'
	, 'stroke-width': 1.44
	, stroke: '#000'
	, 'stroke-linejoin': 'round'
	, 'stroke-linecap': 'round'
	, 'viewBox': new_vbx.join(' ')
	})

	polygon_svg.attr({
		fill: 'none'
	, 'stroke-width': 1.44
	, stroke: '#000'
	, 'stroke-linejoin': 'round'
	, 'stroke-linecap': 'round'
	, 'viewBox': new_vbx.join(' ')
	})

	polygon_svg.polygon(hull_pts.join(' '));

	return {
		after_svg: after_svg.svg(),
		polygon_svg: polygon_svg.svg(),
		before_style
	}

}

module.exports = convert

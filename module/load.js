const { SVG } = require('@svgdotjs/svg.js')

const load = function(svgString){

	var svg;
	var svgRoot;

	if(!svgString || typeof svgString !== 'string'){
		throw Error('invalid SVG string');
	}

	var _svg = SVG(
		'<svg xmlns="http://www.w3.org/2000/svg">'+svgString+'</svg>'
	)
	
	svgRoot = false;
	
	if(_svg){
		svg = _svg;
		
		for(var i=0, children = _svg.children(); i< children.length; i++){
			// svg document may start with comments or text nodes
			var child = children[i];
			if(child.type && child.type == 'svg'){
				svgRoot = child;
				break;
			}
		}
	} else {
		throw new Error("Failed to parse SVG string");
	}

	if(!svgRoot){
		throw new Error("SVG has no children");
	}

	//restoreWindow()

	return {
		svg,
		svgRoot
	}

}

module.exports = load

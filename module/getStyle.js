const cloneDeep = require('lodash/cloneDeep')

// return style node, if any
function getStyle (svgRoot){

	if(!svgRoot){
		return false;
	}

	for(var i=0; i < svgRoot.children().length; i++){
		var el = svgRoot.children()[i];
		if(el.type == 'style'){
			return cloneDeep(el);
		}
	}
	
	return false;
}

module.exports = getStyle

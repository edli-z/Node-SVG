const cloneDeep = require('lodash/cloneDeep')

// remove all elements with tag name not in the whitelist
// use this to remove <text>, <g> etc that don't represent shapes
function _filter(whitelist, element){

	if(!whitelist || whitelist.length == 0){
		throw Error('invalid whitelist');
	}
	
	element.each(function(i){
		_filter(whitelist, this);
	})
	
	if(element.children().length == 0 && whitelist.indexOf(element.type) < 0){
		//element.parentElement.removeChild(element);
		element.remove()
	}

}

function filter(whitelist, _element){
	var element = cloneDeep(_element)
	_filter(whitelist, element)
	return element
}

module.exports = filter

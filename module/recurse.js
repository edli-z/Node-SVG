const cloneDeep = require('lodash/cloneDeep')

// recursively run the given function on the given element
function _recurse(element, func){
	// only operate on original DOM tree, ignore any children that are added. Avoid infinite loops
	var children = Array.prototype.slice.call(element.children());

	for(var i=0; i < children.length; i++){
		_recurse(children[i], func);
	}

	func(element);
}

function recurse(_element, func){
	var element =  cloneDeep(_element)

	_recurse(element, func)

	
	return element
}

module.exports = recurse

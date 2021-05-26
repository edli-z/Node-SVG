const splitPath = require('./splitPath')
const applyTransform = require('./applyTransform')
const flatten = require('./flatten')
const filter = require('./filter')
const recurse = require('./recurse')

function cleanInput(svgRoot, allowedElements){
	var r;

	// apply any transformations, so that all path positions etc will be in the same coordinate space
	r = applyTransform(svgRoot);

	
	// remove any g elements and bring all elements to the top level
	r = flatten(r);

	// remove any non-contour elements like text
	r = filter(allowedElements, r);

	
	// split any compound paths into individual path elements
	r = recurse(r, splitPath);

	return r;
}

module.exports = cleanInput

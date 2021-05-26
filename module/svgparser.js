const load = require("./load")
const cleanInput = require("./cleanInput") 
const getStyle = require("./getStyle") 
const polygonify = require("./polygonify") 

/*!
 * SvgParser
 * A library to convert an SVG string to parse-able segments for CAD/CAM use
 * Licensed under the MIT license
 */
 
function SvgParser(){
	// the SVG document
	this.svg;
	
	// the top level SVG element of the SVG document
	this.svgRoot;
	
	this.allowedElements = ['svg','circle','ellipse','path','polygon','polyline','rect', 'line'];
			
	this.conf = {
		tolerance: 2, // max bound for bezier->line segment conversion, in native SVG units
		toleranceSvg: 0.005 // fudge factor for browser inaccuracy in SVG unit handling
	}; 
}

SvgParser.prototype.config = function(config){
	this.conf.tolerance = config.tolerance;
}

SvgParser.prototype.load = function(svgString){
	const { svg, svgRoot } = load(svgString)
	this.svg = svg
	this.svgRoot = svgRoot
	return this.svgRoot
}

// use the utility functions in this class to prepare the svg for CAD-CAM/nest related operations
SvgParser.prototype.cleanInput = function(){
	this.svgRoot = cleanInput(this.svgRoot, this.allowedElements)
	return this.svgRoot
}

// return style node, if any
SvgParser.prototype.getStyle = function(){
	return getStyle(this.svgRoot)
}

// return a polygon from the given SVG element in the form of an array of points
SvgParser.prototype.polygonify = function(element){
	return polygonify(element, this.conf.tolerance, this.conf.toleranceSvg)
};

// expose public methods
var parser = new SvgParser();

module.exports = {
	config: parser.config.bind(parser),
	load: parser.load.bind(parser),
	getStyle: parser.getStyle.bind(parser),
	clean: parser.cleanInput.bind(parser),
	polygonify: parser.polygonify.bind(parser)
};


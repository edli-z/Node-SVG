const Converter = require('./node_converter_all/utils/Converter') 
const merge = require('./node_converter_all/2-merging')
const final_product = require('./node_converter_all/4-final_product')
const Transforms = require('./node_converter_all/utils/Transforms')
const SVGnest = require('./SVGnest')
const fs = require('fs')
const svgToPdf = require('./svgToPdf')

async function processSVGFiles(arrayOfFilePathsAsInput, outputPath, pdfOutputPath, iteration){

	const c = new Converter()

	c.addArrayOfSvgFiles(arrayOfFilePathsAsInput)

	const { after_svg, polygon_svg, before_style } = c.convert()
		 
	var svgStr = ''

	after_svg.forEach(function({ svg }){
		svgStr += svg
	})

	var polygonSvgStr = merge(polygon_svg)

	var polygonFromSvgNest = await (new SVGnest(polygonSvgStr, iteration)).start()

	const t = new Transforms()

	t.setSvgStr(polygonFromSvgNest)

	var transformedPolygonSvgStr = t.get()

  var finalSvgStr = final_product(svgStr, polygonSvgStr, transformedPolygonSvgStr, before_style)

	fs.writeFile(
		outputPath, 
		finalSvgStr, 
		function (err) {
			if (err) throw err;
		}
	);

	svgToPdf(finalSvgStr, pdfOutputPath)

}

module.exports = processSVGFiles

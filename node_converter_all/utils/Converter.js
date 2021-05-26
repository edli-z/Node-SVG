const convert = require('../1-converter')
const fs = require('fs')
const path = require('path')

class Converter {

	constructor(){
		this.svgStrArray = []
	}

	addSvg(id, svgStr){
		this.svgStrArray.push({
			id,
			svgStr
		})
	}

	addArrayOfSvgFiles(filePathArray){
		filePathArray.forEach((filePath) => {
			this.addSvgFromFile(filePath)
		})
	}

	addSvgFromFile(filePath){

		const svgStr = fs.readFileSync(
			filePath, 
			{ encoding: 'utf8' }
		)

		const id = path.basename(filePath, '.svg')

		this.svgStrArray.push({
			id,
			svgStr
		})

	}

	convert(){

		const after_svg_array = []
		const polygon_svg_array = []
		const before_style_array = []

		this.svgStrArray.forEach(function({ id, svgStr }){

			const { after_svg, polygon_svg, before_style } = convert(svgStr)

			after_svg_array.push({ id, svg: after_svg })

			polygon_svg_array.push({ id, svg: polygon_svg })

			before_style_array.push(before_style)

		})

		return {
			after_svg: after_svg_array,
			polygon_svg: polygon_svg_array,
			before_style: before_style_array
		}

	}

}


module.exports = Converter

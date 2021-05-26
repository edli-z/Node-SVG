const get_transforms = require('../3-get_transforms')
const fs = require('fs')

class Transforms {

	constructor(){
		this.svgStr = ""
	}

	get(){
		return get_transforms(this.svgStr)
	}

	setSvgStr(svgStr){
		this.svgStr = svgStr
	}

	setSvgStrFromFile(filePath){
		this.svgStr = fs.readFileSync(
			filePath, 
			{ encoding: 'utf8' }
		)
	}

}

/*
const t = new Transforms()
t.setSvgStrFromFile("my_test/SVGnest-output.svg")
console.log(t.get())
*/

module.exports = Transforms

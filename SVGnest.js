const SvgNest = require('./module/svgnest') 

const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow } = require('@svgdotjs/svg.js')

const window = createSVGWindow()
const document = window.document

// register window and document
registerWindow(window, document)

class SVGnest {

	constructor(svgStr, iteration){
		this.svgStr = svgStr
		this.iteration = iteration
		this.itNum = 0
		this.promise = false

		this.renderSvg = this.renderSvg.bind(this)
		this.resolve = false
		this.reject = false

		this.result = ''

		this.SvgNest = new SvgNest()
	}

	renderSvg(svglist, efficiency, placed, total){

		this.itNum++

		if(this.itNum > this.iteration){
			this.SvgNest.stop()
			if(typeof this.resolve === 'function'){
				this.resolve(this.result)
			}
		}

		if(!svglist || svglist.length == 0){
			return;
		}

		var bins = SVG();
		
		for(var i=0; i < svglist.length; i++){
			if(svglist.length > 2){
				svglist[i].attr('class','grid');
			}
			svglist[i].addTo(bins)
		}

		this.result = bins.get(0).svg()
		 
	}

	start(){
		return new Promise((resolve, reject) => {

			this.SvgNest.parsesvg(this.svgStr)

			const svg = SVG(this.svgStr)
			const bin = SVG('<rect x="0" y="0" class="fullRect"></rect>')

			bin.attr("width", parseFloat(svg.attr("width")))
			bin.attr("height", parseFloat(svg.attr("height")))

			this.SvgNest.setbin(bin)

			this.resolve = resolve
			this.reject = reject

			this.SvgNest.start(function(){}, this.renderSvg)

		})
	}

}

module.exports = SVGnest

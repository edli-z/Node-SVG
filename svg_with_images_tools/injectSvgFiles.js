const fs = require('fs')
const { SVG, Defs, G } = require('@svgdotjs/svg.js')
const prepareSvgForInjection = require('./prepareSvgForInjection')
const { __removeAlphaChannel, removeAlphaChannel } = require('./removeAlphaChannel')
const constructCentralImage = require('./constructCentralImage')

async function injectSvgFiles(fileNameArray, transformsStr, centralImage, centroids, margin){
	var transforms = SVG(transformsStr)

	var svgArray = fileNameArray.map(fileName => {
		let svgStr = fs.readFileSync(
			fileName, 
			{ encoding: 'utf8' }
		)

		let svg = SVG(prepareSvgForInjection(svgStr))

		return svg
	})

	let centralImageSvgStr = await constructCentralImage(centralImage)
	let centralImageSvg = SVG(prepareSvgForInjection(centralImageSvgStr))

	svgArray = await removeAlphaChannel(svgArray)

	centralImageSvg = await __removeAlphaChannel(centralImageSvg)

	svgArray.push(centralImageSvg)

	const defs = new Defs()

	transforms.find('g.t').forEach(t => {
		let tIndex = parseInt(t.attr("id").replace("t_", ""))
		let svg = svgArray[tIndex]
		let g0 = svg.children()[0]

		let g = new G()
		let centroidIndex = centroids.findIndex(c => c.id === tIndex)
		if(centroidIndex > -1){
			const s = 1 - margin
			const { centroid: c0 } = centroids[centroidIndex]
			const c1 = c0.clone()
			c1.scale(s, s)
			const t = c0.clone()
			t.sub(c1)
			t.scale(1/s, 1/s)
			g.attr('transform', 'scale(' + s + ' ' + s + ') translate(' + t.x + ' ' + t.y + ')')
		}

		g0.addTo(g)
		g.addTo(t)
		t.find('defs').forEach((d) => {
			d.children().forEach((child) => {
				child.addTo(defs)
			})
			d.remove()
		})
	})

	transforms.get(0).before(defs)

	return transforms.svg()
}

module.exports = injectSvgFiles

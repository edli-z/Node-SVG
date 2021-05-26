const imageDataURI = require('image-data-uri')
const Buffer = require('buffer').Buffer
const PNG = require("pngjs").PNG
const { Readable, Writable } = require('stream')

function _removeAlphaChannel(dataURI){

	return new Promise(function(resolve){

		let { dataBuffer: inputBuffer, imageType } = imageDataURI.decode(dataURI)

		if(!(imageType === 'image/png')){
			resolve(dataURI)
			return
		}

		let inputStream = Readable.from(inputBuffer)
		let outputBuffer = Buffer.alloc(0)
		let outputStream = new Writable()

		outputStream._write = function(chunk, encoding, done){
			outputBuffer = Buffer.concat([outputBuffer, chunk])
			done()
		}

		outputStream.on('finish', function(){
			resolve(imageDataURI.encode(outputBuffer, 'PNG'))
		})

		inputStream
			.pipe(
				new PNG({
					colorType: 2,
					bgColor: {
						red: 0,
						green: 255,
						blue: 0,
					},
				})
			)
			.on("parsed", function(){
				this.pack().pipe(outputStream);
			});

	})
}

async function __removeAlphaChannel(svg){
	let images = svg.find('image')
	for(let j = 0; j < images.length; j++){
		let image = images[j]
		if(image.attr('clip-path') || image.attr('mask')){
			let dataURI = image.attr('xlink:href')
			if(dataURI){
				dataURI = await _removeAlphaChannel(dataURI)
				image.attr('xlink:href', dataURI)
			}
		}
	}
	return svg
}

async function removeAlphaChannel(svgArray){
	for(let i = 0; i < svgArray.length; i++){
		let svg = svgArray[i]
		let images = svg.find('image')
		for(let j = 0; j < images.length; j++){
			let image = images[j]
			if(image.attr('clip-path') || image.attr('mask')){
				let dataURI = image.attr('xlink:href')
				if(dataURI){
					dataURI = await _removeAlphaChannel(dataURI)
					image.attr('xlink:href', dataURI)
				}
			}
		}
	}
	return svgArray
}

exports.removeAlphaChannel = removeAlphaChannel
exports.__removeAlphaChannel = __removeAlphaChannel

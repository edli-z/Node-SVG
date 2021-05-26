const convertSvgWithImg = require('./convertSvgWithImg')
const constructCentralImage = require('./constructCentralImage')

async function convertCentralImage(buffer){
	const svgStr = await constructCentralImage(buffer) 
	return convertSvgWithImg(svgStr)
}

/*
convertCentralImage("test-output/m.jpg").then(function(r){
	console.log(r)
})
*/

module.exports = convertCentralImage

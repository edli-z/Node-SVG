const PDFDocument = require('pdfkit')
const SVGtoPDF = require('svg-to-pdfkit')
const fs = require('fs');

function svgToPdf(svgStr0, svgStr1, outputPath){
	const doc = new PDFDocument({size: [792, 612]});
	doc.pipe(fs.createWriteStream(outputPath));
	SVGtoPDF(doc, svgStr0, 0, 0);
	doc.addPage()
	SVGtoPDF(doc, svgStr1, 0, 0);
	doc.end()
}

/*
const svgStr = fs.readFileSync(
	"test-output/x/x11.svg", 
	//"node_converter_all/signatures/701/1619969168583.svg",
	//"node_converter_all/signatures/703/1620313708966.svg",
	{ encoding: 'utf8' }
)

svgToPdf(svgStr, 'test-output/direct.pdf')
*/

module.exports = svgToPdf

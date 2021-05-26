const processSVGFiles = require("./processSVGFiles")

processSVGFiles(
	[
		"node_converter_all/signatures/615/1614174772405.svg",
		"node_converter_all/signatures/616/1614174980890.svg",
		"node_converter_all/signatures/701/1619969168583.svg"
	],
	"node_converter_all/final/processSVGFiles-output.svg", //svg output filename
	"node_converter_all/final/processSVGFiles-output.pdf", //pdf output filename
	4 //iteration
)

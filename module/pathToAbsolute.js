const cloneDeep = require('lodash/cloneDeep')
const SvgPath = require('svgpath')

function pathToAbsolute(_path){
	if(!_path || _path.type != 'path'){
		throw Error('invalid path');
	}

	let path = cloneDeep(_path)

	const pathData = new SvgPath(path.attr("d"))

	path.plot(pathData.abs().toString())

	return path
}

module.exports = pathToAbsolute

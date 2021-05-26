const cloneDeep = require('lodash/cloneDeep')

function _flatten(element){

	for(var i=0; i < element.children().length; i++){
		_flatten(element.children()[i]);
	}
	
	if(!(element.type === 'svg')){
		while(element.children().length > 0){
			//element.parentElement.appendChild(element.childNodes[0]);
			(element.children()[0]).addTo(element.parent())
		}
	}

}

function flatten(_element){
	var element = cloneDeep(_element)
	_flatten(element)
	return element
}

module.exports = flatten

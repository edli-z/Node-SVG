function getPoints(element){
	r = []
	const pointsStr = element.attr('points')
	if(typeof pointsStr === 'string'){
		const points = pointsStr.split(/\s/)
		if(Array.isArray(points)){
			for(let i = 0; i < points.length; i++){
				const point = points[i].split(/\s*,\s*/)
				if(Array.isArray(point)){
					r[i] = {
						x: parseFloat(point[0]),
						y: parseFloat(point[1])
					}
				}
			}
		}
	}
	return r
}

module.exports = getPoints

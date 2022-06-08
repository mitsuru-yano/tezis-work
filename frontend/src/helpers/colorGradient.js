function hex(c) {
	var s = '0123456789abcdef'
	var i = parseInt(c)
	if (i === 0 || isNaN(c)) return '00'
	i = Math.round(Math.min(Math.max(0, i), 255))
	return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16)
}

function convertToHex(rgb) {
	return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2])
}

function trim(s) {
	return s.charAt(0) === '#' ? s.substring(1, 7) : s
}

function convertToRGB(hex) {
	var color = []
	color[0] = parseInt(trim(hex).substring(0, 2), 16)
	color[1] = parseInt(trim(hex).substring(2, 4), 16)
	color[2] = parseInt(trim(hex).substring(4, 6), 16)
	return color
}

function generateColor(colorStart, colorEnd, colorCount) {
	var start = convertToRGB(colorStart)
	var end = convertToRGB(colorEnd)
	var len = colorCount
	var alpha = 0.0
	var saida = []
	for (let i = 0; i < len; i++) {
		var c = []
		alpha += 1.0 / len
		c[0] = end[0] * alpha + (1 - alpha) * start[0]
		c[1] = end[1] * alpha + (1 - alpha) * start[1]
		c[2] = end[2] * alpha + (1 - alpha) * start[2]
		saida.push(convertToHex(c))
	}
	return saida
}

export default generateColor

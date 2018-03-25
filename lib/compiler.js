
var opcodes = {
	stop: 	'00',
	add:  	'01',
	mul:  	'02',
	sub:  	'03',
	div:  	'04',
}

function compile(text) {
	return opcodes[text];
}

module.exports = {
	compile: compile
}


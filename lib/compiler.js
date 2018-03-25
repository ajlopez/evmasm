
var opcodes = {
	stop: 	'00',
	add:  	'01',
	mul:  	'02',
	sub:  	'03',
	div:  	'04',
	sdiv:	'05',
	mod:	'06',
	smod:	'07',
	addmod: '08',
	mulmod: '09',
	exp:	'0a',
	signextend: '0b'
}

function compile(text) {
	return opcodes[text.toLowerCase()];
}

module.exports = {
	compile: compile
}



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
	signextend: '0b',
	
	lt:		'10',
	gt:		'11',
	slt:	'12',
	sgt:	'13',
	eq:		'14',
	iszero:	'15',
	and:	'16',
	or:		'17',
	xor:	'18',
	not:	'19',
	byte:	'1a',
	
	sha3:	'20',
}

function compile(text) {
	return opcodes[text.toLowerCase()];
}

module.exports = {
	compile: compile
}


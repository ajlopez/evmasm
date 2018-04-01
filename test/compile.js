
var evmasm = require('..');

exports['compile simple expression'] = function (test) {
	var bytecode = evmasm.compile('mstore(0x40, 0x60)');
	
	test.ok(bytecode);
	test.equal(bytecode, '6060604052');
}

exports['compile simple expression with prologue'] = function (test) {
	var bytecode = evmasm.compile('EVM assembly: mstore(0x40, 0x60)');
	
	test.ok(bytecode);
	test.equal(bytecode, '6060604052');
}

exports['compile simple expression with prologue and assembly'] = function (test) {
	var bytecode = evmasm.compile('EVM assembly: mstore(0x40, 0x60) datasize(sub_0) dataoffset(sub_0) stop sub_0: assembly { stop }');
	
	test.ok(bytecode);
	test.equal(bytecode, '60606040526001600a0000');
}

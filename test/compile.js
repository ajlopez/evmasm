
var evmasm = require('..');

var fs = require('fs');
var path = require('path');

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

exports['compile opcode expression'] = function (test) {
	var bytecode = evmasm.compile('opcode(0xfa)');
	
	test.ok(bytecode);
	test.equal(bytecode, 'fa');
}

exports['compile data expression'] = function (test) {
	var bytecode = evmasm.compile('data(0x01020304)');
	
	test.ok(bytecode);
	test.equal(bytecode, '01020304');
}

exports['compile file'] = function (test) {
	var filename = path.join(__dirname, 'counter.asm');
	var code = fs.readFileSync(filename).toString();
	
	var bytecode = evmasm.compile(code);
	
	test.ok(bytecode);
	test.ok(bytecode.indexOf('60606040') === 0);
	test.ok(bytecode.indexOf('a165627a7a723058209c14b0491dc15ac395ea1519522f3b1b4162ad8e2a8a0f4e9b43e8b2963c528e0029') > 0);
}

exports['compile defined opcode'] = function (test) {
	evmasm.define('foofoo', 'fa');
	var bytecode = evmasm.compile('foofoo(0x40, 0x60)');
	
	test.ok(bytecode);
	test.equal(bytecode, '60606040fa');
}

exports['compile extcodehash'] = function (test) {
	var bytecode = evmasm.compile('extcodehash(0x40)');
	
	test.ok(bytecode);
	test.equal(bytecode, '60403f');
}

exports['compile extcodesize'] = function (test) {
	var bytecode = evmasm.compile('extcodesize(0x40)');
	
	test.ok(bytecode);
	test.equal(bytecode, '60403b');
}

exports['compile selfbalance'] = function (test) {
	var bytecode = evmasm.compile('selfbalance');
	
	test.ok(bytecode);
	test.equal(bytecode, '47');
}

exports['compile selfbalance without arguments'] = function (test) {
	var bytecode = evmasm.compile('selfbalance()');
	
	test.ok(bytecode);
	test.equal(bytecode, '47');
}

exports['compile chainid'] = function (test) {
	var bytecode = evmasm.compile('chainid');
	
	test.ok(bytecode);
	test.equal(bytecode, '46');
}

exports['compile chainid without arguments'] = function (test) {
	var bytecode = evmasm.compile('chainid()');
	
	test.ok(bytecode);
	test.equal(bytecode, '46');
}


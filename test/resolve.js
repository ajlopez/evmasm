
var parsers = require('../lib/parsers');

exports['resolve label reference'] = function (test) {
	var parser = parsers.parser('tag1');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.reference(), 'tag1');
	test.equal(expr.code(), '61____');
	test.equal(expr.codesize(), 3);
	
	test.equal(parser.parseExpression(), null);

	test.ok(expr.resolve);
	expr.resolve({ tag1: { offset: 42 } });
	test.equal(expr.code(), '602a');
	test.equal(expr.codesize(), 2);
}

exports['resolve datasize'] = function (test) {
	var parser = parsers.parser('datasize(sub_0)');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.code(), '61____');
	test.equal(expr.codesize(), 3);
	
	test.equal(parser.parseExpression(), null);

	test.ok(expr.resolve);
	expr.resolve({ sub_0: { codesize: 42 } });
	test.equal(expr.code(), '602a');
	test.equal(expr.codesize(), 2);
}

exports['resolve assembly offsets'] = function (test) {
	var parser = parsers.parser('tag1: 0x60 0x40 mstore jump(tag3) tag2: stop tag3: jump(tag2)');
	
	var assm = parser.parseAssembly();
		
	test.equal(assm.code(), '5b606060405261____565b005b61____56');
	
	assm.resolve();

	test.equal(assm.code(), '5b6060604052600b565b005b600956');
}

exports['resolve assembly datasize'] = function (test) {
	var parser = parsers.parser('dataSize(sub_0) stop sub_0: assembly { 0x60 0x40 mstore }');
	
	var assm = parser.parseAssembly();
		
	test.equal(assm.code(), '61____006060604052');
	
	assm.resolve();

	test.equal(assm.code(), '6005006060604052');
}

exports['resolve assembly dataoffset'] = function (test) {
	var parser = parsers.parser('dataOffset(sub_0) stop sub_0: assembly { 0x60 0x40 mstore }');
	
	var assm = parser.parseAssembly();
		
	test.equal(assm.code(), '61____006060604052');
	
	assm.resolve();

	test.equal(assm.code(), '6003006060604052');
}


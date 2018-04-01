
var parsers = require('../lib/parsers');

exports['parse name expression'] = function (test) {
	var parser = parsers.parser('foo');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.name(), 'foo');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse opcode expression with code'] = function (test) {
	var parser = parsers.parser('mstore');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.name(), 'mstore');
	test.equal(expr.codesize(), 1);
	test.equal(expr.code(), '52');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse hexadecimal integer expression'] = function (test) {
	var parser = parsers.parser('0x2a');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.value(), '0x2a');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse hexadecimal integer expression with code'] = function (test) {
	var parser = parsers.parser('0x0');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.value(), '0x0');
	test.equal(expr.code(), '6000');
	test.equal(expr.codesize(), 2);
	
	test.equal(parser.parseExpression(), null);
}

exports['parse integer expression with code'] = function (test) {
	var parser = parsers.parser('42');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.value(), '42');
	test.equal(expr.code(), '602a');
	test.equal(expr.codesize(), 2);
	
	test.equal(parser.parseExpression(), null);
}

exports['parse two-bytes hexadecimal integer expression with code'] = function (test) {
	var parser = parsers.parser('0x100');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.value(), '0x100');
	test.equal(expr.code(), '610100');
	test.equal(expr.codesize(), 3);
	
	test.equal(parser.parseExpression(), null);
}

exports['parse call expression'] = function (test) {
	var parser = parsers.parser('mstore(0x40, 0x60)');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.code(), '6060604052');
	test.equal(expr.codesize(), 5);
	
	test.equal(parser.parseExpression(), null);
}

exports['parse unsolved name to label'] = function (test) {
	var parser = parsers.parser('tag1');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.name(), 'tag1');
	test.equal(expr.code(), '61____');
	test.equal(expr.codesize(), 3);
	
	test.equal(parser.parseExpression(), null);

	test.ok(expr.resolve);
	expr.resolve({ tag1: 42 });
	test.equal(expr.code(), '602a');
	test.equal(expr.codesize(), 2);
}

exports['parse unsolved dataSize'] = function (test) {
	var parser = parsers.parser('dataSize(sub_0)');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.reference(), 'sub_0');
	test.equal(expr.code(), '61____');
	test.equal(expr.codesize(), 3);
	
	test.equal(parser.parseExpression(), null);
}

exports['parse unsolved dataOffset'] = function (test) {
	var parser = parsers.parser('dataOffset(sub_0)');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.reference(), 'sub_0');
	test.equal(expr.code(), '61____');
	test.equal(expr.codesize(), 3);
	
	test.equal(parser.parseExpression(), null);
}

exports['parse and compile assembly expression'] = function (test) {
	var parser = parsers.parser('assembly { tag1: 0x60 0x40 mstore tag2: stop }');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
		
	test.equal(expr.code(), '5b60606040525b00');
	test.equal(expr.codesize(), 8);
	
	test.equal(parser.parseExpression(), null);
}

exports['parse segment'] = function (test) {
	var parser = parsers.parser('0x60 0x40 mstore');
	
	var expr = parser.parseSegment();
	
	test.ok(expr);
	test.equal(expr.code(), '6060604052');
	test.equal(expr.codesize(), 5);
	
	test.equal(parser.parseSegment(), null);
}

exports['parse segment with initial label'] = function (test) {
	var parser = parsers.parser('tag1: 0x60 0x40 mstore');
	
	var segm = parser.parseSegment();
	
	test.ok(segm);
	test.equal(segm.code(), '5b6060604052');
	test.equal(segm.codesize(), 6);
	test.equal(segm.label(), 'tag1');
	
	test.equal(parser.parseSegment(), null);
}

exports['parse two segments with labels'] = function (test) {
	var parser = parsers.parser('tag1: 0x60 0x40 mstore tag2: stop');
	
	var segm = parser.parseSegment();
	
	test.ok(segm);
	test.equal(segm.code(), '5b6060604052');
	test.equal(segm.codesize(), 6);
	test.equal(segm.label(), 'tag1');
	
	var segm = parser.parseSegment();
	
	test.ok(segm);
	test.equal(segm.code(), '5b00');
	test.equal(segm.codesize(), 2);
	test.equal(segm.label(), 'tag2');

	test.equal(parser.parseSegment(), null);
}

exports['parse assembly with two segments'] = function (test) {
	var parser = parsers.parser('tag1: 0x60 0x40 mstore tag2: stop');
	
	var assm = parser.parseAssembly();
	
	test.ok(assm);
	test.ok(assm.segments());
	test.ok(Array.isArray(assm.segments()));
	test.equal(assm.segments().length, 2);
	
	var segm = assm.segments()[0];
	
	test.ok(segm);
	test.equal(segm.code(), '5b6060604052');
	test.equal(segm.codesize(), 6);
	test.equal(segm.label(), 'tag1');
	
	var segm = assm.segments()[1];
	
	test.ok(segm);
	test.equal(segm.code(), '5b00');
	test.equal(segm.codesize(), 2);
	test.equal(segm.label(), 'tag2');

	test.equal(parser.parseSegment(), null);
	
	test.equal(assm.code(), '5b60606040525b00');
	test.equal(assm.codesize(), 8);
}

exports['resolve assembly offsets'] = function (test) {
	var parser = parsers.parser('tag1: 0x60 0x40 mstore jump(tag3) tag2: stop tag3: jump(tag2)');
	
	var assm = parser.parseAssembly();
		
	test.equal(assm.code(), '5b606060405261____565b005b61____56');
	
	assm.resolve();

	test.equal(assm.code(), '5b6060604052600b565b005b600956');
}

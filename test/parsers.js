
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


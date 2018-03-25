
var parsers = require('../lib/parsers');

exports['parse name expression'] = function (test) {
	var parser = parsers.parser('foo');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.name(), 'foo');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse opcode expression'] = function (test) {
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


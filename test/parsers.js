
var parsers = require('../lib/parsers');

exports['parse name expression'] = function (test) {
	var parser = parsers.parser('foo');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.name(), 'foo');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse hexadecimal integer expression'] = function (test) {
	var parser = parsers.parser('0x2a');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.value(), '0x2a');
	
	test.equal(parser.parseExpression(), null);
}


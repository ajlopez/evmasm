
var lexers = require('../lib/lexers');
var TokenType = lexers.TokenType;

exports['create lexer as object'] = function (test) {
	var lexer = lexers.lexer();
	
	test.ok(lexer);
	test.equal(typeof lexer, 'object');
};

exports['get name token'] = function (test) {
	var lexer = lexers.lexer('foo');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
};


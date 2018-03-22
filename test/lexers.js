
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

exports['get name token with spaces'] = function (test) {
	var lexer = lexers.lexer('  foo  ');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
};

exports['get two name tokens'] = function (test) {
	var lexer = lexers.lexer('foo bar');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'bar');
	test.equal(token.type, TokenType.Name);

	test.equal(lexer.nextToken(), null);
};

exports['get parenthesis as punctuation'] = function (test) {
	var lexer = lexers.lexer('()');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, '(');
	test.equal(token.type, TokenType.Punctuation);
		
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, ')');
	test.equal(token.type, TokenType.Punctuation);

	test.equal(lexer.nextToken(), null);
};

exports['get colon as punctuation'] = function (test) {
	var lexer = lexers.lexer(':');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, ':');
	test.equal(token.type, TokenType.Punctuation);

	test.equal(lexer.nextToken(), null);
};



const lexers = require('../lib/lexers');
const TokenType = lexers.TokenType;

exports['create lexer as object'] = function (test) {
	const lexer = lexers.lexer();
	
	test.ok(lexer);
	test.equal(typeof lexer, 'object');
};

exports['get name token'] = function (test) {
	const lexer = lexers.lexer('foo');
	
	const token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
};

exports['push token'] = function (test) {
	const lexer = lexers.lexer('foo');
	
	lexer.pushToken(lexer.nextToken());
	const token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
};

exports['get label token'] = function (test) {
	const lexer = lexers.lexer('foo:');
	
	const token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'foo');
	test.equal(token.type, TokenType.Label);
	
	test.equal(lexer.nextToken(), null);
};

exports['get name token with spaces'] = function (test) {
	const lexer = lexers.lexer('  foo  ');
	
	const token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
};

exports['get name token with digits'] = function (test) {
	const lexer = lexers.lexer('foo42');
	
	const token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'foo42');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
};

exports['get name token with underscore and digits'] = function (test) {
	const lexer = lexers.lexer('tag_42');
	
	const token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'tag_42');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
};

exports['get two name tokens'] = function (test) {
	const lexer = lexers.lexer('foo bar');
	
	const token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	
	const token2 = lexer.nextToken();
	
	test.ok(token2);
	test.equal(token2.value, 'bar');
	test.equal(token2.type, TokenType.Name);

	test.equal(lexer.nextToken(), null);
};

exports['get two name tokens skipping comment'] = function (test) {
	const lexer = lexers.lexer('foo/* this is a comment */bar');
	
	const token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	const token2 = lexer.nextToken();
	
	test.ok(token2);
	test.equal(token2.value, 'bar');
	test.equal(token2.type, TokenType.Name);

	test.equal(lexer.nextToken(), null);
};

exports['get two name tokens skipping comment with spaces and new line'] = function (test) {
	const lexer = lexers.lexer('foo /* this is\n a comment*/ bar');
	
	const token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	const token2 = lexer.nextToken();
	
	test.ok(token2);
	test.equal(token2.value, 'bar');
	test.equal(token2.type, TokenType.Name);

	test.equal(lexer.nextToken(), null);
};

exports['get two name tokens skipping line comment'] = function (test) {
	const lexer = lexers.lexer('foo// this is a line comment \nbar');
	
	const token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	const token2 = lexer.nextToken();
	
	test.ok(token2);
	test.equal(token2.value, 'bar');
	test.equal(token2.type, TokenType.Name);

	test.equal(lexer.nextToken(), null);
};

exports['get parenthesis as punctuation'] = function (test) {
	const lexer = lexers.lexer('()');
	
	const token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, '(');
	test.equal(token.type, TokenType.Punctuation);
		
	const token2 = lexer.nextToken();
	
	test.ok(token2);
	test.equal(token2.value, ')');
	test.equal(token2.type, TokenType.Punctuation);

	test.equal(lexer.nextToken(), null);
};

exports['get name and parentheses'] = function (test) {
	const lexer = lexers.lexer('foo()');
	
	const token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'foo');
	test.equal(token.type, TokenType.Name);

	const token2 = lexer.nextToken();
	
	test.ok(token2);
	test.equal(token2.value, '(');
	test.equal(token2.type, TokenType.Punctuation);
		
	const token3 = lexer.nextToken();
	
	test.ok(token3);
	test.equal(token3.value, ')');
	test.equal(token3.type, TokenType.Punctuation);

	test.equal(lexer.nextToken(), null);
};

exports['get colon as punctuation'] = function (test) {
	const lexer = lexers.lexer(':');
	
	const token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, ':');
	test.equal(token.type, TokenType.Punctuation);

	test.equal(lexer.nextToken(), null);
};

exports['get integer number'] = function (test) {
	const lexer = lexers.lexer('42');
	
	const token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, '42');
	test.equal(token.type, TokenType.Integer);

	test.equal(lexer.nextToken(), null);
};

exports['get hexadecimal integer number'] = function (test) {
	const lexer = lexers.lexer('0x2a');
	
	const token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, '0x2a');
	test.equal(token.type, TokenType.Integer);

	test.equal(lexer.nextToken(), null);
};



var lexers = require('./lexers');
var TokenType = lexers.TokenType;

function NameExpression(name) {
	this.name = function() { return name; };
}

function IntegerExpression(value) {
	this.value = function () { return value; };
}

function Parser(text) {
	var lexer = lexers.lexer(text);
	
	this.parseExpression = function () {
		var token = lexer.nextToken();
		
		if (!token)
			return null;
		
		if (token.type === TokenType.Name)
			return new NameExpression(token.value);
		
		if (token.type === TokenType.Integer)
			return new IntegerExpression(token.value);
	}
}

function createParser(text) {
	return new Parser(text);
}

module.exports = {
	parser: createParser
}


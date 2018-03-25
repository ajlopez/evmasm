
var lexers = require('./lexers');

function NameExpression(name) {
	this.name = function() { return name; };
}

function Parser(text) {
	var lexer = lexers.lexer(text);
	
	this.parseExpression = function () {
		var token = lexer.nextToken();
		
		if (!token)
			return null;
		
		return new NameExpression(token.value);
	}
}

function createParser(text) {
	return new Parser(text);
}

module.exports = {
	parser: createParser
}



var TokenType = { Name: 1 };

function Lexer(text) {
	var p = 0;
	var l = text ? text.length : 0;
	
	this.nextToken = function () {
		if (p >= l)
			return null;
		
		var token = { value: text, type: TokenType.Name };
		
		p = l;
		
		return token;
	}
}

function createLexer(text) {
	return new Lexer(text);
}

module.exports = {
	lexer: createLexer,
	TokenType: TokenType
}



var TokenType = { Name: 1 };

function Lexer(text) {
	var p = 0;
	var l = text ? text.length : 0;
	
	this.nextToken = function () {
		skipWhiteSpaces();
		
		if (p >= l)
			return null;
		
		var value = '';
		
		while (p < l)
			if (isWhiteSpace(text[p]))
				break;
			else
				value += text[p++];
		
		var token = { value: value, type: TokenType.Name };
		
		return token;
	}
	
	function skipWhiteSpaces() {
		while (p < l)
			if (!isWhiteSpace(text[p]))
				return;
			else
				p++;
	}
	
	function isWhiteSpace(ch) {
		return ch <= ' ';
	}
}

function createLexer(text) {
	return new Lexer(text);
}

module.exports = {
	lexer: createLexer,
	TokenType: TokenType
}


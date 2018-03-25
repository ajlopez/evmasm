
var TokenType = { Name: 1, Punctuation: 2, Integer: 3 };

function Lexer(text) {
	var p = 0;
	var l = text ? text.length : 0;
	
	this.nextToken = function () {
		skipWhiteSpaces();
		
		if (p >= l)
			return null;
		
		var ch = text[p++];
		
		if (isLetter(ch))
			return getName(ch);
		
		if (isDigit(ch))
			return getInteger(ch);

		var token = { value: ch, type: TokenType.Punctuation };
		
		return token;
	}

	function getName(ch) {
		var value = ch;
		
		while (p < l)
			if (!isNameCharacter(text[p]))
				break;
			else
				value += text[p++];
		
		var token = { value: value, type: TokenType.Name };
		
		return token;		
	}
	
	function getInteger(ch) {
		var value = ch;
		
		if (value === '0' && text[p] === 'x')
			return getHexadecimalInteger();
		
		while (p < l)
			if (!isDigit(text[p]))
				break;
			else
				value += text[p++];
		
		var token = { value: value, type: TokenType.Integer };
		
		return token;		
	}
	
	function getHexadecimalInteger(ch) {
		p++;
		var value = '0x';
		
		while (p < l)
			if (!isHexadecimalDigit(text[p]))
				break;
			else
				value += text[p++];
		
		var token = { value: value, type: TokenType.Integer };
		
		return token;		
	}

	function skipWhiteSpaces() {
		while (p < l)
			if (!isWhiteSpace(text[p])) {
				if (text[p] === '/' && text[p+1] === '*') {
					skipComment();
					continue;
				}
				
				return;
			}
			else
				p++;
	}
	
	function skipComment() {
		while (p < l)
			if (text[p] === '*' && text[p+1] === '/') {
				p += 2;
				return;
			}
			else
				p++;
	}
	
	function isNameCharacter(ch) {
		return isLetter(ch) || isDigit(ch) || ch === '_';
	}
	
	function isWhiteSpace(ch) {
		return ch <= ' ';
	}

	function isLetter(ch) {
		return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z';
	}

	function isDigit(ch) {
		return ch >= '0' && ch <= '9';
	}

	function isHexadecimalDigit(ch) {
		return ch >= '0' && ch <= '9' || ch >= 'a' && ch <= 'f' || ch >= 'A' && ch <= 'F';
	}
}

function createLexer(text) {
	return new Lexer(text);
}

module.exports = {
	lexer: createLexer,
	TokenType: TokenType
}


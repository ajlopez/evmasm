
const TokenType = { Name: 1, Punctuation: 2, Integer: 3, Label: 4 };

function Lexer(text) {
	let p = 0;
	const l = text ? text.length : 0;
	const tokens = [];
	
	this.pushToken = function (token) {
		tokens.push(token);
	};
	
	this.nextToken = function () {
		if (tokens.length)
			return tokens.pop();
		
		skipWhiteSpaces();
		
		if (p >= l)
			return null;
		
		const ch = text[p++];
		
		if (isLetter(ch))
			return getName(ch);
		
		if (isDigit(ch))
			return getInteger(ch);

		const token = { value: ch, type: TokenType.Punctuation };
		
		return token;
	}

	function getName(ch) {
		let value = ch;
		
		while (p < l)
			if (!isNameCharacter(text[p]))
				break;
			else
				value += text[p++];
			
		if (text[p] === ':') {
			p++;
			return { value: value, type: TokenType.Label };
		}
		
		return { value: value, type: TokenType.Name };
	}
	
	function getInteger(ch) {
		let value = ch;
		
		if (value === '0' && text[p] === 'x')
			return getHexadecimalInteger();
		
		while (p < l)
			if (!isDigit(text[p]))
				break;
			else
				value += text[p++];
		
		const token = { value: value, type: TokenType.Integer };
		
		return token;		
	}
	
	function getHexadecimalInteger(ch) {
		p++;
		let value = '0x';
		
		while (p < l)
			if (!isHexadecimalDigit(text[p]))
				break;
			else
				value += text[p++];
		
		const token = { value: value, type: TokenType.Integer };
		
		return token;		
	}

	function skipWhiteSpaces() {
		while (p < l)
			if (!isWhiteSpace(text[p])) {
				if (text[p] === '/' && text[p+1] === '*') {
					skipComment();
					continue;
				}
				
				if (text[p] === '/' && text[p+1] === '/') {
					skipLineComment();
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
	
	function skipLineComment() {
		while (p < l)
			if (text[p] === '\n')
				return;
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


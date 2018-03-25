
var lexers = require('./lexers');
var TokenType = lexers.TokenType;
var compiler = require('./compiler');

function isHexadecimal(value) {
	return value.substring(0, 2) === '0x';
}

function normalizeHexadecimal(value) {
	value = value.substring(2);
	
	if (value.length % 2)
		value = '0' + value;
	
	return value;
}

function normalizeDecimal(value) {
	value = parseInt(value).toString(16);
		
	if (value.length % 2)
		value = '0' + value;
	
	return value;
}

function NameExpression(name) {
	this.name = function() { return name; };
	this.code = function() { return compiler.compile(name); };
	this.codesize = function() { return this.code().length / 2; };
}

function IntegerExpression(value) {
	this.value = function () { return value; };
	
	this.code = function () {
		if (isHexadecimal(value))
			var hex = normalizeHexadecimal(value);
		else
			var hex = normalizeDecimal(value);
		
		var l = hex.length / 2;
		var opcode = (0x60 + l - 1).toString(16);
		
		return opcode + hex;
	};
	
	this.codesize = function () { return this.code().length / 2; };
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


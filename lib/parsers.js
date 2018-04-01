
var lexers = require('./lexers');
var TokenType = lexers.TokenType;
var compiler = require('./compiler');

function isHexadecimal(value) {
	return typeof value === 'string' && value.substring(0, 2) === '0x';
}

function normalizeHexadecimal(value) {
	value = value.substring(2);
	
	if (value.length % 2)
		value = '0' + value;
	
	return value;
}

function normalizeDecimal(value) {
	if (typeof value === 'string')
		value = parseInt(value);
	
	value = value.toString(16);
		
	if (value.length % 2)
		value = '0' + value;
	
	return value;
}

function NameExpression(name) {
	this.name = function() { return name; };
	this.code = function() { return compiler.compile(name); };
	this.codesize = function() { return this.code().length / 2; };
}

function LabelReferenceExpression(name) {
	var offset = -1;
	
	this.name = function () { return name; };
	
	this.code = function () {
		if (offset < 0)
			return compiler.compile('push2') + '____';
		
		return new IntegerExpression(offset).code();
	}
	
	this.codesize = function () { return this.code().length / 2; };
	
	this.resolve = function (labels) {
		if (labels[name] != null)
			offset = labels[name];
	}
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

function CallExpression(name, exprs) {
	this.code = function () {
		var code = '';
		
		for (var k = exprs.length; k--;)
			code += exprs[k].code();
		
		code += compiler.compile(name);
		
		return code;
	}
	
	this.codesize = function () {
		return this.code().length / 2;
	}
	
	this.resolve = function (labels) {
		for (var k = exprs.length; k--;)
			if (exprs[k].resolve)
				exprs[k].resolve(labels);
	}
}

function ReferenceExpression(reference) {
	this.reference = function() { return reference; };
	this.code = function() { return compiler.compile('push2') + '____'; };
	this.codesize = function() { return this.code().length / 2; };
}

function AssemblyExpression(assembly) {
	this.code = function () { return assembly.code(); };
	this.codesize = function () { return assembly.codesize(); };
}

function CodeSegment(label, exprs) {
	this.label = function () { return label; };
	
	this.code = function () {
		var code = label ? '5b' : '';
		
		for (var k = 0; k < exprs.length; k++)
			code += exprs[k].code();
		
		return code;
	};
	
	this.codesize = function () { return this.code().length / 2; };
	
	this.resolve = function (labels) {
		for (var k = 0; k < exprs.length; k++)
			if (exprs[k].resolve)
				exprs[k].resolve(labels);
	}
}

function Assembly(segments) {
	this.segments = function () { return segments; };
	this.code = function () {
		var code = '';
		
		for (var k = 0; k < segments.length; k++)
			code += segments[k].code();
		
		return code;
	}
	
	this.codesize = function () { return this.code().length / 2; };
	
	this.resolve = function () {
		var code = this.code();

		resolveLabels();
		
		var newcode = this.code();
		
		while (newcode !== code) {
			code = newcode;
			resolveLabels();
			newcode = this.code();
		}
	}
	
	function resolveLabels() {
		var labels = calculateLabelOffsets();

		for (var k = 0; k < segments.length; k++)
			segments[k].resolve(labels);
	}
	
	function calculateLabelOffsets() {
		var labels = {};
		var offset = 0;

		for (var k = 0; k < segments.length; k++) {
			var label = segments[k].label();
			
			if (label)
				labels[label] = offset;
			
			offset += segments[k].codesize();
		}
		
		return labels;
	}
}

function Parser(text) {
	var lexer = lexers.lexer(text);
	var self = this;
	
	this.parseAssembly = function () {
		var segments = [];
		
		for (var segm = this.parseSegment(); segm; segm = this.parseSegment())
			segments.push(segm);
		
		if (segments.length === 0)
			return null;
		
		return new Assembly(segments);
	}
	
	this.parseSegment = function () {
		var label;
		
		var token = lexer.nextToken();
		
		if (token && token.type === TokenType.Label)
			label = token.value;
		else
			lexer.pushToken(token);
		
		var exprs = [];
		
		for (var expr = this.parseExpression(); expr; expr = this.parseExpression())
				exprs.push(expr);
			
		if (exprs.length === 0)
			return null;
		
		return new CodeSegment(label, exprs);
	}
	
	this.parseExpression = function () {
		var token = lexer.nextToken();
		
		if (!token)
			return null;
		
		if (token.type === TokenType.Name) {
			var verb = token.value.toLowerCase();

			if (verb === 'datasize' || verb === 'dataoffset') {
				parseToken(TokenType.Punctuation, '(');
				var reference = parseName();
				parseToken(TokenType.Punctuation, ')');
				
				return new ReferenceExpression(reference);
			}
			
			if (verb === 'assembly') {
				parseToken(TokenType.Punctuation, '{');
				var assembly = this.parseAssembly();
				parseToken(TokenType.Punctuation, '}');
				
				return new AssemblyExpression(assembly);
			}

			if (tryParseToken(TokenType.Punctuation, '(')) {
				var exprs = parseExpressionList();
				return new CallExpression(token.value, exprs);
			}
			
			if (compiler.compile(token.value))
				return new NameExpression(token.value);
			
			return new LabelReferenceExpression(token.value);
		}
		
		if (token.type === TokenType.Integer)
			return new IntegerExpression(token.value);
		
		lexer.pushToken(token);
		
		return null;
	}
	
	function parseToken(type, value) {
		var token = lexer.nextToken();
		
		if (!token || token.type !== type || token.value !== value)
			throw new Error("Expected '" + value + "'");
	}
	
	function parseName() {
		var token = lexer.nextToken();
		
		if (!token || token.type !== TokenType.Name)
			throw new Error("Name expected");
		
		return token.value;
	}

	function tryParseName(name) {
		var token = lexer.nextToken();
		
		if (token && token.type === TokenType.Name && token.value.toLowerCase() === name)
			return true;
		
		lexer.pushToken(token);
		
		return false;
	}

	function tryParseToken(type, value) {
		var token = lexer.nextToken();
		
		if (!token)
			return false;
		
		if (token.type !== type || token.value !== value) {
			lexer.pushToken(token);
			return false;
		}
		
		return true;
	}
	
	function parseExpressionList() {
		var exprs = [];
		
		while (!tryParseToken(TokenType.Punctuation, ')')) {
			if (exprs.length)
				parseToken(TokenType.Punctuation, ',');
			
			exprs.push(self.parseExpression());
		}
		
		return exprs;
	}
}

function createParser(text) {
	return new Parser(text);
}

module.exports = {
	parser: createParser
}


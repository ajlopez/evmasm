
const lexers = require('./lexers');
const TokenType = lexers.TokenType;
const compiler = require('./compiler');

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

function LabelReferenceExpression(reference) {
	let offset = -1;
	
	this.reference = function () { return reference; };
	
	this.code = function () {
		if (offset < 0)
			return compiler.compile('push2') + '____';
		
		return new IntegerExpression(offset).code();
	}
	
	this.codesize = function () { return this.code().length / 2; };
	
	this.resolve = function (labels) {
		if (labels[reference] != null && labels[reference].offset != null)
			offset = labels[reference].offset;
	}
}

function IntegerExpression(value) {
	this.value = function () { return value; };
	
	this.code = function () {
        const hex = isHexadecimal(value) ? normalizeHexadecimal(value) : normalizeDecimal(value);
		
		const l = hex.length / 2;
		const opcode = (0x60 + l - 1).toString(16);
		
		return opcode + hex;
	};
	
	this.codesize = function () { return this.code().length / 2; };
}

function LiteralExpression(value) {
	this.value = function () { return value; };
	
	this.code = function () {
        return isHexadecimal(value) ? normalizeHexadecimal(value) : normalizeDecimal(value);
	};
	
	this.codesize = function () { return this.code().length / 2; };
}

function CallExpression(name, exprs) {
	this.code = function () {
		let code = '';
		
		for (let k = exprs.length; k--;)
			code += exprs[k].code();
		
		code += compiler.compile(name);
		
		return code;
	}
	
	this.codesize = function () {
		return this.code().length / 2;
	}
	
	this.resolve = function (labels) {
		for (let k = exprs.length; k--;)
			if (exprs[k].resolve)
				exprs[k].resolve(labels);
	}
}

function DataSizeExpression(reference) {
	let size = -1;
	
	this.reference = function () { return reference; };
	
	this.code = function () {
		if (size < 0)
			return compiler.compile('push2') + '____';
		
		return new IntegerExpression(size).code();
	}
	
	this.codesize = function () { return this.code().length / 2; };
	
	this.resolve = function (labels) {
		if (labels[reference] != null && labels[reference].codesize != null)
			size = labels[reference].codesize;
	}
}

function AssemblyExpression(assembly) {
	this.code = function () { return assembly.code(); };
	this.codesize = function () { return assembly.codesize(); };
	this.resolve = function () { assembly.resolve(); };
}

function CodeSegment(label, exprs) {
	this.label = function () { return label; };
	
	this.code = function () {
		if (!exprs.length)
			return '';
		
		let code = hasJumpLabel() ? '5b' : '';
		
		for (let k = 0; k < exprs.length; k++)
			code += exprs[k].code();
		
		return code;
	};
	
	this.codesize = function () { return this.code().length / 2; };
	
	this.resolve = function (labels) {
		for (let k = 0; k < exprs.length; k++)
			if (exprs[k].resolve)
				exprs[k].resolve(labels);
	}
	
	function hasJumpLabel() {
		if (!label)
			return false;
		
		if (exprs[0] instanceof AssemblyExpression)
			return false;
		
		return true;
	}
}

function Assembly(segments) {
	this.segments = function () { return segments; };
	this.code = function () {
		let code = '';
		
		for (let k = 0; k < segments.length; k++)
			code += segments[k].code();
		
		return code;
	}
	
	this.codesize = function () { return this.code().length / 2; };
	
	this.resolve = function () {
		let code = this.code();

		resolveLabels();
		
		let newcode = this.code();
		
		while (newcode !== code) {
			code = newcode;
			resolveLabels();
			newcode = this.code();
		}
	}
	
	function resolveLabels() {
		const labels = calculateLabelData();

		for (let k = 0; k < segments.length; k++)
			segments[k].resolve(labels);
	}
	
	function calculateLabelData() {
		const labels = {};
		let offset = 0;

		for (let k = 0; k < segments.length; k++) {
			const label = segments[k].label();
			const codesize = segments[k].codesize();
			
			if (label)
				labels[label] = { offset: offset, codesize: codesize };
			
			offset += codesize;
		}
		
		return labels;
	}
}

function Parser(text) {
	const lexer = lexers.lexer(text);
	const self = this;
	
	this.parseAssembly = function () {
		const segments = [];
		
		if (tryParseName('evm'))
			parseToken(TokenType.Label, 'assembly');
		
		for (let segm = this.parseSegment(); segm; segm = this.parseSegment())
			segments.push(segm);
		
		if (segments.length === 0)
			return null;
		
		return new Assembly(segments);
	}
	
	this.parseSegment = function () {
		let label;
		
		const token = lexer.nextToken();
		
		if (token && token.type === TokenType.Label) {
			if (token.value === 'auxdata') {
				const auxdata = parseInteger();
				const auxdataexpr = new LiteralExpression(auxdata);
				return new CodeSegment(null, [ auxdataexpr ])
			}
			
			label = token.value;
		}
		else
			lexer.pushToken(token);
		
		const exprs = [];
		
		for (let expr = this.parseExpression(); expr; expr = this.parseExpression())
				exprs.push(expr);
			
		if (exprs.length === 0 && !label)
			return null;
		
		return new CodeSegment(label, exprs);
	}
	
	this.parseExpression = function () {
		const token = lexer.nextToken();
		
		if (!token)
			return null;
		
		if (token.type === TokenType.Name) {
			const verb = token.value.toLowerCase();

			if (verb === 'datasize' || verb === 'dataoffset') {
				parseToken(TokenType.Punctuation, '(');
				const reference = parseName();
				parseToken(TokenType.Punctuation, ')');
    
				if (verb === 'dataoffset')
					return new LabelReferenceExpression(reference);
				else
					return new DataSizeExpression(reference);
			}
			
			if (verb === 'opcode' || verb === 'data') {
				parseToken(TokenType.Punctuation, '(');
				const integer = parseInteger();
				parseToken(TokenType.Punctuation, ')');

				return new LiteralExpression(integer);
			}
			
			if (verb === 'assembly') {
				parseToken(TokenType.Punctuation, '{');
				const assembly = this.parseAssembly();
				parseToken(TokenType.Punctuation, '}');
				
				return new AssemblyExpression(assembly);
			}

			if (tryParseToken(TokenType.Punctuation, '(')) {
				const exprs = parseExpressionList();
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
		const token = lexer.nextToken();
		
		if (!token || token.type !== type || token.value !== value)
			throw new Error("Expected '" + value + "'");
	}
	
	function parseInteger() {
		const token = lexer.nextToken();
		
		if (!token || token.type !== TokenType.Integer)
			throw new Error("Number expected");
		
		return token.value;
	}

	function parseName() {
		const token = lexer.nextToken();
		
		if (!token || token.type !== TokenType.Name)
			throw new Error("Name expected");
		
		return token.value;
	}

	function tryParseName(name) {
		const token = lexer.nextToken();
		
		if (token && token.type === TokenType.Name && token.value.toLowerCase() === name)
			return true;
		
		lexer.pushToken(token);
		
		return false;
	}

	function tryParseToken(type, value) {
		const token = lexer.nextToken();
		
		if (!token)
			return false;
		
		if (token.type !== type || token.value !== value) {
			lexer.pushToken(token);
			return false;
		}
		
		return true;
	}
	
	function parseExpressionList() {
		const exprs = [];
		
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



var compiler = require('./compiler');
var parsers = require('./parsers');

function compile(code) {
	var assembly = parsers.parser(code).parseAssembly();
	
	assembly.resolve();
	
	return assembly.code();
}

module.exports = {
	compile: compile,
	define: compiler.define
}
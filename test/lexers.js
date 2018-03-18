
var lexers = require('../lib/lexers');

exports['create lexer as object'] = function (test) {
	var lexer = lexers.lexer();
	
	test.ok(lexer);
	test.equal(typeof lexer, 'object');
};
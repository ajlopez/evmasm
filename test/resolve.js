
var parsers = require('../lib/parsers');

exports['resolve assembly offsets'] = function (test) {
	var parser = parsers.parser('tag1: 0x60 0x40 mstore jump(tag3) tag2: stop tag3: jump(tag2)');
	
	var assm = parser.parseAssembly();
		
	test.equal(assm.code(), '5b606060405261____565b005b61____56');
	
	assm.resolve();

	test.equal(assm.code(), '5b6060604052600b565b005b600956');
}

exports['resolve assembly datasize'] = function (test) {
	var parser = parsers.parser('datasize(sub_0) stop sub0: assembly { 0x60 0x40 mstore }');
	
	var assm = parser.parseAssembly();
		
	test.equal(assm.code(), '61____006060604052');
	
	assm.resolve();

	test.equal(assm.code(), '6006006060604052');
}



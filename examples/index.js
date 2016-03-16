'use strict';

var wandbox = require( './../lib' );

function clbk( error, results ) {
	if ( error ) {
		throw new Error( error.message );
	}
	console.log( results );
	// returns {...}
}

// From file...
wandbox( './examples/fixtures/code.cpp', clbk );

// From string...
var code = '#include <iostream>\nint main() {\n\tstd::cout << "All is well" << std::endl;}';

wandbox.fromString( code, clbk );

'use strict';

// MODULES //

var debug = require( 'debug' )( 'wandbox:string' );
var copy = require( 'utils-copy' );
var cwd = require( 'utils-cwd' );
var defaults = require( './defaults.json' );
var validate = require( './validate.js' );


// FROM STRING //

/**
* FUNCTION: fromString( code[, options], clbk )
*	Compile and run a source code string on Wandbox.
*
* @param {String} code - source code
* @param {Object} [options] - function options
* @param {String} [options.compiler='gcc-head'] - compiler name
* @param {Array} [options.files] - supporting files
* @param {String[]} [options.options=["boost-1.60","warning","gnu++1y"]] - compiler-dependent options
* @param {String} [options.stdin] - standard input
* @param {String[]} [options.compileOptions] - compile options
* @param {String[]} [options.runtimeOptions] - runtime options
* @param {Boolean} [options.permalink=false] - boolean indicating whether to return a permanent link
* @param {Function} clbk - callback to invoke after receiving results
* @returns {Void}
*/
function fromString() {
	var opts;
	var clbk;
	var code;
	var err;
	var dir;

	code = arguments[ 0 ];
	opts = copy( defaults );
	if ( arguments.length === 2 ) {
		clbk = arguments[ 1 ];
	} else {
		clbk = arguments[ 2 ];
		err = validate( opts, arguments[1] );
		if ( err ) {
			throw err;
		}
	}
	dir = cwd();
	debug( 'Current working directory: %s', dir );

	// Add `code` key to options holding the source code to run on Wandbox...
	opts.code = code;

	request.post( 'http://melpon.org/wandbox/api/compile.json', {
		'body': opts,
		'json': true
	}, done );

	/**
	* FUNCTION: done( error, response, body )
	*	Callback invoked after receiving a response.
	*
	* @private
	* @param {Error|Null} error - error object
	* @param {Object} response - HTTP response
	* @param {Object} body - response body
	* @returns {Void}
	*/
	function done( error, response, body ) {
		if ( error ) {
			return clbk( error );
		}
		clbk( null, body );
	} // end FUNCTION done()
} // end FUNCTION fromString()


// EXPORTS //

module.exports = fromString;

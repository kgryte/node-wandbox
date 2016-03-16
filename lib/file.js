'use strict';

// MODULES //

var debug = require( 'debug' )( 'wandbox:file' );
var copy = require( 'utils-copy' );
var cwd = require( 'utils-cwd' );
var readFile = require( 'utils-fs-read-file' );
var resolve = require( 'path' ).resolve;
var defaults = require( './defaults.json' );
var validate = require( './validate.js' );


// FROM FILE //

/**
* FUNCTION: fromFile( src[, options], clbk )
*	Compile and run a source file on Wandbox.
*
* @param {String} src - source file
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
function file() {
	var opts;
	var clbk;
	var src;
	var err;
	var dir;

	src = arguments[ 0 ];
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

	inputFile = resolve( dir, src );
	debug( 'Input file: %s', inputFile );

	readFile( inputFile, {'encoding':'utf8'}, onFile );
	/**
	* FUNCTION: onFile( error, file )
	*	Callback invoked upon reading a file.
	*
	* @private
	* @param {Error|Null} error - error object
	* @param {String} data - file contents
	* @returns {Void}
	*/
	function onFile( error, data ) {
		if ( error ) {
			debug( 'Error encountered while attempting to read a input file %s: %s', inputFile, error.message );
			return done( error );
		}
		debug( 'Successfully read input file: %s', inputFile );

		// Add `code` key to options holding the source code to run on Wandbox...
		opts.code = data;

		request.post( 'http://melpon.org/wandbox/api/compile.json', {
			'body': opts,
			'json': true
		}, done );
	}
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
} // end FUNCTION file()


// EXPORTS //

module.exports = file;

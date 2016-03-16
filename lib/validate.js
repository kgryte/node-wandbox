'use strict';

// MODULES //

var isBoolean = require( 'validate.io-boolean-primitive' );
var isObject = require( 'validate.io-object' );
var isArray = require( 'validate.io-array' );
var isString = require( 'validate.io-string-primitive' );
var isStringArray = require( 'validate.io-string-primitive-array' );


// VALIDATE //

/**
* FUNCTION: validate( opts, options )
*	Validates function options.
*
* @param {Object} opts - destination object
* @param {Object} options - options to validate
* @param {String} [options.compiler] - compiler name
* @param {Array} [options.files] - supporting files
* @param {String} [options.options] - compiler-dependent options
* @param {String} [options.stdin] - standard input
* @param {String} [options.compileOptions] - compile options
* @param {String} [options.runtimeOptions] - runtime options
* @param {Boolean} [options.permalink] - boolean indicating whether to return a permanent link
* @returns {Error|Null} error or null
*/
function validate( opts, options ) {
	if ( !isObject( options ) ) {
		return new TypeError( 'invalid input argument. Options argument must be an object. Value: `' + options + '`.' );
	}
	if ( options.hasOwnProperty( 'compiler' ) ) {
		opts.compiler = options.compiler;
		if ( !isString( opts.compiler ) ) {
			return new TypeError( 'invalid option. `compiler` option must be a string primitive. Option: `' + opts.compiler + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'files' ) ) {
		opts.files = options.files;
		if ( !isArray( opts.files ) ) {
			return new TypeError( 'invalid option. `files` option must be an array. Option: `' + opts.files + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'options' ) ) {
		opts.options = options.options;
		if ( !isStringArray( opts.options ) ) {
			return new TypeError( 'invalid option. `options` option must be an array of string primitives. Option: `' + opts.options + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'stdin' ) ) {
		opts.stdin = options.stdin;
		if ( !isString( opts.stdin ) ) {
			return new TypeError( 'invalid option. `stdin` option must be a string primitive. Option: `' + opts.stdin + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'compileOptions' ) ) {
		opts.compileOptions = options.compileOptions;
		if ( !isStringArray( opts.compileOptions ) ) {
			return new TypeError( 'invalid option. `compileOptions` option must be an array of string primitives. Option: `' + opts.compileOptions + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'runtimeOptions' ) ) {
		opts.runtimeOptions = options.runtimeOptions;
		if ( !isStringArray( opts.runtimeOptions ) ) {
			return new TypeError( 'invalid option. `runtimeOptions` option must be an array of string primitives. Option: `' + opts.runtimeOptions + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'permalink' ) ) {
		opts.permalink = options.permalink;
		if ( !isBoolean( opts.permalink ) ) {
			return new TypeError( 'invalid option. `permalink` option must be a boolean primitive. Option: `' + opts.permalink + '`.' );
		}
	}
	return null;
} // end FUNCTION validate()


// EXPORTS //

module.exports = validate;

Wandbox
===
[![NPM version][npm-image]][npm-url] [![Build Status][build-image]][build-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependencies][dependencies-image]][dependencies-url]

> Compile and run a program using [Wandbox][wandbox].


## Installation

``` bash
$ npm install wandbox
```


## Usage

``` javascript
var wandbox = require( 'wandbox' );
```

<a name="wandbox"></a>
#### wandbox( src[, options], clbk )

Compiles and run a `src` file using [Wandbox][wandbox]. Consider the following `C++` file

``` cpp
// File: program.cpp
#include <iostream>
int main() {
	std::cout << "All is well" << std::endl;
}
```

To compile and run on [Wandbox][wandbox],

``` javascript
wandbox( './program.cpp', clbk );

function clbk( error, results ) {
	if ( error ) {
		throw new Error( error.message );
	}
	console.log( results );
	/* returns
		{
			"program_message": "All is well\n",
			"program_output": "All is well\n",
			"status": "0"
		}
	*/
}
```

The `function` accepts the following `options`:
*	__files__: supporting files. Default: `[]`.
*	__options__: compiler-dependent options; e.g., whether to display `warnings`, use a particular Boost version, etc. Default: `[]`.
*	__compiler__: compiler name. Default: `'gcc-head'`.
*	__compileOptions__: an `array` of compiler options . Default: `[]`.
*	__runtimeOptions__: an `array` of runtime options. Default: `[]`.
*	__stdin__: standard input. Default: `''`.
*	__permalink__: `boolean` indicating whether a permanent static hyperlink should be generated. Default: `false`.

A supporting file can be specified as either a filename or an `object` containing `file` and `code` keys. The function reads each file into memory before sending to [Wandbox][wandbox]. Suppose we have the following files:

``` cpp
// File: program.cpp
#include <iostream>
#include "add.h"

int main() {
	std::cout << "Addition: " << add(5,2) << std::endl;
}
```

``` cpp
// File: add.h
#ifndef ADD_H
#define ADD_H

int add(int x, int y);

#endif
``` 

``` cpp
// File: add.cpp
#include "add.h"

int add(int x, int y) {
	return x + y;
}
```

To compile and run,

``` javascript
var opts = {
	'files': [
		'./add.h',
		'./add.cpp'
	],
	'compileOptions': [
		'add.cpp'		// Note: we need to add the additional *.cpp files to be compiled
	]
};

wandbox( './program.cpp', clbk );

function clbk( error, results ) {
	if ( error ) {
		throw new Error( error.message );
	}
	console.log( results );
	/* returns
		{
			"program_message": "Addition: 7\n",
			"program_output": "Addition: 7\n",
			"status": "0"
		}
	*/
}
```

Alternatively, if supporting file source code resides in-memory,

``` javascript
var opts = {
	'files': [
		{
			'file': 'add.h',
			'code': '#ifndef ADD_H\n#define ADD_H\nint add(int x, int y);\n#endif'
		},
		{
			'file': 'add.cpp',
			'code': '#include \"add.h\"\nint add(int x, int y) {return x + y;}'
		}
	],
	'compileOptions': [
		'add.cpp'		// Note: we need to add the additional *.cpp files to be compiled
	]
};

wandbox( './program.cpp', clbk );
```

A combination of both filenames and in-memory source code is also supported.

``` javascript
var opts = {
	'files': [
		'./add.h',
		{
			'file': 'add.cpp',
			'code': '#include \"add.h\"\nint add(int x, int y) {return x + y;}'
		}
	],
	'compileOptions': [
		'add.cpp'		// Note: we need to add the additional *.cpp files to be compiled
	]
};

wandbox( './program.cpp', clbk );
```

The default compiler is `gcc-head`. To use an alternative compiler, set the `compiler` option. For example, given the following Python file

``` python
# File: main.py
print("I can also run Python.")
```

to run using a Python runtime,

```javascript
var opts = {
	'compiler': 'python-3.5.0'
};

wandbox( './main.py', opts, clbk );

function clbk( error, results ) {
	if ( error ) {
		throw new Error( error.message );
	}
	console.log( results );
	/* returns
		{
			program_message: 'I can also run Python.\n',
			program_output: 'I can also run Python.\n',
			status: '0'
		}
	*/
}
```

To specify options associated with a particular compiler, set the `options` option. For example, provided the following `C++` file

``` cpp
// File: program.cpp
#include <iostream>
int main() {
	int x = 0;
	std::cout << "hoge" << std::endl;
}
```

to set associated options,

```javascript
var opts = {
	'options': [
		'warning',
		'gnu++ly'
	]
};

wandbox( './program.cpp', opts, clbk );

function clbk( error, results ) {
	if ( error ) {
		throw new Error( error.message );
	}
	console.log( results );
	/* returns
		{
			"compiler_error": "prog.cc: In function \'int main()\':\nprog.cc:2:19: warning: unused variable \'x\' [-Wunused-variable]\n  int main() { int x = 0; std::cout << "hoge" << std::endl; }\n                   ^\n",
			"compiler_message": "prog.cc: In function \'int main()\':\nprog.cc:2:19: warning: unused variable \'x\' [-Wunused-variable]\n  int main() { int x = 0; std::cout << "hoge" << std::endl; }\n                   ^\n",
			"program_message": "hoge\n",
			"program_output": "hoge\n",
			"status": "0"
		}
	*/
}
```

To generate a permanent link to the compiled program, set the `permalink` option to `true`.

```javascript
var opts = {
	'compiler': 'python-3.5.0',
	'permalink': true
};

wandbox( './main.py', opts, clbk );

function clbk( error, results ) {
	if ( error ) {
		throw new Error( error.message );
	}
	console.log( results );
	/* returns
		{
			"permlink": "hcx4qh0WIkX2YDps",
			"program_message": "I can also run Python.\n",
			"program_output": "I can also run Python.\n",
			"status": "0",
			"url": "http://melpon.org/wandbox/permlink/hcx4qh0WIkX2YDps"
		}
	*/
}
```


#### wandbox.fromString( code[, options], clbk )

Compile and run a source code `string`.

```javascript
var code = '#include <iostream>\nint main() {\n\tstd::cout << "All is well" << std::endl;}';

wandbox.fromString( code, clbk );

function clbk( error, results ) {
	if ( error ) {
		throw new Error( error.message );
	}
	console.log( results );
	// returns {...}
}
```

This method accepts the same `options` as [`wandbox`](#wandbox).


---
## Notes

*	Filenames are resolved relative to the current working directory.
*	Depending on option configuration and program output, the results [`object`][wandbox-docs] may have the following fields:
	*	__status__: exit code.
	*	__signal__: signal message.
	*	__compiler_output__: `stdout` during compilation.
	*	__compiler_error__: `stderr` during compilation.
	*	__compiler_message__: merged `compiler_output` and `compiler_error`.
	*	__program_output__: `stdout` during runtime.
	*	__program_error__: `stderr` during runtime.
	*	__program_message__: merged `program_output` and `program_error`.
	*	__permlink__: link portion of permanent static hyperlink.
	*	__url__: permanent static hyperlink to compiled program.


---
## Examples

``` javascript
var wandbox = require( 'wandbox' );

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
```

To run the example code from the top-level application directory,

``` bash
$ DEBUG=* node ./examples/index.js
```


---
## CLI

### Installation

To use the module as a general utility, install the module globally

``` bash
$ npm install -g wandbox
```


### Usage

``` bash
Usage: wandbox [options] src

Options:

  -h,  --help                Print this message.
  -V,  --version             Print the package version.
       --file                Boolean indicating whether src is a file path or code to be evaluated. Default: false.
       --compiler            Name of used compiler. Default: gcc-head.
       --options             Used options for a compiler joined by comma. Default: boost-1.60,warning,gnu++1y.
       --codes               Additional codes, objects with `file` and `code` keys. Default: [].
       --save                Boolean indicating whether permanent link should be generated. Default: false.
       --stdin               Standard input.
       --compiler-option-raw Additional compile-time options joined by line-break. Default: "".
       --runtime-option-raw  Additional run-time options joined by line-break. Default: "".
  -o,  --output file          Output file path.
```


### Examples

Setting the compiler using the command-line option:

``` bash
$ DEBUG=* wandbox --compiler <compiler> <code comes here>
# => '[{...},{...},...]'
```

For local installations, modify the command to point to the local installation directory; e.g.,

``` bash
$ DEBUG=* ./node_modules/.bin/wandbox --file --compiler <compiler> <file_path comes here>
# => '[{...},{...},...]'
```

Or, if you have cloned this repository and run `npm install`, modify the command to point to the executable; e.g.,

``` bash
$ DEBUG=* node ./bin/cli --compiler <compiler> <code comes here>
# => '[{...},{...},...]'
```


---
## Tests

### Unit

This repository uses [tape][tape] for unit tests. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul][istanbul] as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


### Browser Support

This repository uses [Testling][testling] for browser testing. To run the tests in a (headless) local web browser, execute the following command in the top-level application directory:

``` bash
$ make test-browsers
```

To view the tests in a local web browser,

``` bash
$ make view-browser-tests
```

<!-- [![browser support][browsers-image]][browsers-url] -->


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2016. Philipp Burckhardt.


[npm-image]: http://img.shields.io/npm/v/wandbox.svg
[npm-url]: https://npmjs.org/package/wandbox

[build-image]: http://img.shields.io/travis/Planeshifter/node-wandbox/master.svg
[build-url]: https://travis-ci.org/Planeshifter/node-wandbox

[coverage-image]: https://img.shields.io/codecov/c/github/Planeshifter/node-wandbox/master.svg
[coverage-url]: https://codecov.io/github/Planeshifter/node-wandbox?branch=master

[dependencies-image]: http://img.shields.io/david/Planeshifter/node-wandbox.svg
[dependencies-url]: https://david-dm.org/Planeshifter/node-wandbox

[dev-dependencies-image]: http://img.shields.io/david/dev/Planeshifter/node-wandbox.svg
[dev-dependencies-url]: https://david-dm.org/dev/Planeshifter/node-wandbox

[github-issues-image]: http://img.shields.io/github/issues/Planeshifter/node-wandbox.svg
[github-issues-url]: https://github.com/Planeshifter/node-wandbox/issues

[tape]: https://github.com/substack/tape
[istanbul]: https://github.com/gotwarlost/istanbul
[testling]: https://ci.testling.com

[wandbox]: http://melpon.org/wandbox/
[wandbox-docs]: https://github.com/melpon/wandbox/blob/master/kennel2/API.rst

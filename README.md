# n-input

Low level input semantics.

Typically prefer to use a high level controller rather than this package
directly.

## Usage

See the tests in the `Editor/` folder for each class for usage examples.

## Install

From your unity project folder:

    npm init
    npm install shadowmint/unity-n-core --save
    echo Assets/packages >> .gitignore
    echo Assets/packages.meta >> .gitignore

The package and all its dependencies will be installed in
your Assets/packages folder.

## Development

Setup and run tests:

    npm install
    npm install ..
    cd test
    npm install
    gulp

Remember that changes made to the test folder are not saved to the package
unless they are copied back into the source folder.

To reinstall the files from the src folder, run `npm install ..` again.

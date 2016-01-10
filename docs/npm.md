![NPM + Unity = <3](https://raw.github.com/shadowmint/unity-package-template/master/docs/images/heart.png)

## What? Why?

C# has a package manager which is already rather good;
[NuGet](https://www.nuget.org/).

However, it's designed around distributing assemblies, not source code.

Installing a NuGet package also has a number of side effects; to quote their website:

>When you install a package, NuGet copies files to your solution and automatically makes whatever changes are needed, such as adding references and changing your app.config or web.config file. If you decide to remove the library, NuGet removes files and reverses whatever changes it made in your project so that no clutter is left.

Finally, it's [technically complex](http://docs.nuget.org/Create/Creating-and-Publishing-a-Package) to setup. Ultimately, it's not the right tool for Unity.

Unity [asset bundles](http://docs.unity3d.com/Manual/AssetBundlesIntro.html) basically extract a set of assets and source files directly into your project, but they have some severe limitations:

- You cannot have an asset bundle with external dependencies.
- Version control with asset bundles is difficult.

People have [blogged about](http://blog.juiceboxmobile.com/2013/06/19/per-asset-versioning-with-unity-asset-bundles/) the challenges asset bundles pose and various ways to solve them, but this repository is here to demonstrate an alternative solution: NPM.

## What's NPM?

NPM is the node package manager.

You can read about it in detail at the npm website:

https://docs.npmjs.com/getting-started/what-is-npm

It's a fully featured robust package manager for the node ecosystem.

Probably the first question is almost certainly going to be:

> ...but, node uses javascript, and I use C# in my project.

...which is true, but npm isn't tied to just javascript. People use it to distrubte
styles, images, files and... code in languages other than javascript. It can do a
number of things such as:

- Distribute source files for any language.
- Compile native targets cross platform for plugins.
- Manage complex version hierarchies of dependencies.
- Use both a central package repository or private source package urls.

## Using NPM to install a package

So, what would installing a package, including it's dependencies look like using npm?

First you have to configure your project to use npm, using: `npm init`
```
Clank:foo doug$ npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg> --save` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
name: (foo)
version: (1.0.0)
description:
entry point: (index.js)
test command:
git repository:
keywords:
author:
license: (ISC)
About to write to /Users/doug/dev/unity/foo/package.json:

{
  "name": "foo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}


Is this ok? (yes)
```

Once that's done, install a github package using: `npm install`

```
Clank:foo doug$ npm install --save shadowmint/unity-n-input

> unity-n-core@0.0.1 postinstall /Users/doug/dev/unity/foo/node_modules/unity-n-core
> node scripts/postinstall.js


> unity-n-input@0.0.2 postinstall /Users/doug/dev/unity/foo/node_modules/unity-n-input
> node scripts/postinstall.js

foo@1.0.0 /Users/doug/dev/unity/foo
└─┬ unity-n-input@0.0.2  (git://github.com/shadowmint/unity-n-input.git#58e81fa6fd53e2c20327018612540757fdecb02f)
  ├─┬ mkdirp@0.5.1
  │ └── minimist@0.0.8
  ├── ncp@2.0.0
  └── unity-n-core@0.0.1  (git://github.com/shadowmint/unity-n-core.git#f3e0c4d31e1bb8fd8bf699c8fe06e0e74f459561)

npm WARN EPACKAGEJSON foo@1.0.0 No description
npm WARN EPACKAGEJSON foo@1.0.0 No repository field.
```

As you can see the `unity-n-input` package installed `unity-n-core` as a dependency; and if you look in the `Assets` folder, you'll see all the C# files:

```
./Assets/packages/n-core/core/env/Arguments.cs
./Assets/packages/n-core/core/env/Arguments.cs.meta
./Assets/packages/n-core/core/env
./Assets/packages/n-core/core/env.meta
./Assets/packages/n-core/core/random/Random.cs
./Assets/packages/n-core/core/random/Random.cs.meta
./Assets/packages/n-core/core/random
./Assets/packages/n-core/core/random.meta
./Assets/packages/n-core/core/reflect/Editor/EnumTests.cs
./Assets/packages/n-core/core/reflect/Editor/EnumTests.cs.meta
./Assets/packages/n-core/core/reflect/Editor/PropTests.cs
./Assets/packages/n-core/core/reflect/Editor/PropTests.cs.meta
./Assets/packages/n-core/core/reflect/Editor/TypeTests.cs
./Assets/packages/n-core/core/reflect/Editor/TypeTests.cs.meta
./Assets/packages/n-core/core/reflect/Editor/ValidatorTests.cs
./Assets/packages/n-core/core/reflect/Editor/ValidatorTests.cs.meta
./Assets/packages/n-input/controller/ControllerConfig.cs
./Assets/packages/n-input/controller/ControllerConfig.cs.meta
...
```

Notice that npm supports a [variety of remote urls](https://docs.npmjs.com/files/package.json#urls-as-dependencies), including private packages over ssh and dependencies on local folders.

It's robust, battle tested and works cross platform; basically a great solution for managing packages for Unity. :)

## How do you write an NPM package?

So... what about writing a new package?

Pretty simple, add a `package.json` to your repository.

Here's what it looks like:

```
{
  "name": "unity-TEMPLATE", <-- Your package's name
  "version": "0.0.1",       <-- Semantic version number
  "description": "...",
  "main": "index.js",
  "repository": {
    "type": "git",
    "url": "..."
  },
  "files": [                <--- List of files to download and install
    "index.js",
    "scripts",
    "src"
  ],
  "author": "...",
  "license": "MIT",
  "bugs": {
    "url": "..."
  },
  "homepage": "...",
  "scripts": {              <-- Install script, build script, etc.
    "postinstall": "node scripts/postinstall.js"
  },
  "dependencies": {         <-- Dependencies for this package, by version
    "ncp": "^2.0.0",
    "mkdirp": "^0.5.1",
    "unity-n-input": "github:shadowmint/unity-n-input#0.0.1"
  }
}
```

The `package.json` format is completely and comprehensively documented here:

https://docs.npmjs.com/files/package.json

Notice that in this case the package dependency is just pointing to a github url, not a published npm package. Personally I'm not sure how I feel about publishing C# packages on the npm registry; it *is* for javascript, and explicit remote urls work just fine, but that your pick.

Certainly `npm install my-unity-package --save` is easier to do than:

`npm install --save git+ssh://me@myserver.com:~/unity-packages/animation.git`

...but with the latter you can use private repositories, while npm registry private repositories are a [paid feature](https://www.npmjs.com/private-modules). Still, npm is flexible enough to use it however you want.

### That Assets folder...

Notice in the `package.json` above there is a 'postinstall' script. This is a script that gets invoked after a package has completely finished installing, and is useful in some cases where you need to copy files around and so forth.

Turns out that with Unity packages that's something you do want; because by default packages are installed into `node_modules` and not into the `Assets` folder.

So you add a little helper script to run after the local install into `node_modules` is complete:

```
var mkdirp = require('mkdirp');
var path = require('path');
var ncp = require('ncp');

// Paths
var src = path.join(__dirname, '..', 'src');
var dir = path.join(__dirname, '..', '..', '..', 'Assets', 'packages');

// Create folder if missing
mkdirp(dir, function (err) {
  if (err) {
    console.error(err)
    process.exit(1);
  }

  // Copy files
  ncp(src, dir, function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
});
```

Now, this *is* javascript, and although it doesn't have to be, if you're writing an npm package, it's probably best to stick with it.

However, it is simple enough that I don't think it's any real concern to manage; create the `Assets/packages` folder if it doesn't exist, and then recursively copy all of the files in `src` from this repository into it.

That's basically what a normal asset bundle does.

In this case it's best to also add the `Assets/packages` (or whatever folder you install into), to your ignore file, otherwise next time you run npm install it'll overwrite all those files again.

## Putting it all together

So, finally, all the parts all working together can be found here, as an easy to use template for writing a new package:

https://github.com/shadowmint/unity-package-template

Search for 'TEMPLATE' in the package and replace the various instances and you're good to go.

Not that keen to use a template?

You can also port any existing package over as well, just by adding a few extra files. You can see the excellent FullSerializer package by Jacob Dufault turned into an npm package by this one simple and [non-intrusive commit](https://github.com/shadowmint/fullserializer/commit/b06fedad2a50f90c66ddf20dc394b042d8db8053).

Now using FullSeriailizer is as simple as:

`npm install --save shadowmint/fullserializer`

Tell me that isn't just darn cool.

<3 NPM.

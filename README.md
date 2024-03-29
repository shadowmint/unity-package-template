# TEMPLATE

...

## Install

From your unity project folder:

    npm init
    npm install --save git+ssh://git@github.com:shadowmint/TEMPLATE.git --no-progress
    echo Assets/pkg-all >> .gitignore
    echo Assets/pkg-all.meta >> .gitignore

To avoid typing the password in every time, consider using `ssh-add`.

The package and all its dependencies will be installed in your Assets/pkg-all folder.

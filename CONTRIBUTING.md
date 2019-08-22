# Contributing to rSR
Follow the guide below if you'd like to get rSR running locally to start contributing.

## Repository Setup
1. Clone this repository.
1. Run `cd rsr` to change into this repo's directory.
1. Run `npm link` to create a symlink on your system.

You will now be able to create a project locally and have access to the rSR CLI in that project. Follow the steps below to create a new local project and test your local copy of rSR out on it.

## Local Project Testing Setup
1. Create a new project and `cd` into its directory.
1. Run `npm link @reintroducing/rsr` in your new project directory.
1. Run `rsr -e contrib` to download all the necessary dependencies so that your project can run effectively and you can test any rSR command.
1. Run `rsr` to initialize a new project and scaffold the files.

You can now run other commands like `rsr -e start` and `rsr -e build` to see what happens to your project based on any edits you make to the rSR source code.

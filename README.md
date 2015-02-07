# drunken-octo-sansa
A graphical tool for manipulating sinon.fakeServer (http://sinonjs.org/docs/#fakeServer). 

## Overview

**Sinon.JS** provides a fake HttpRequest implementation which can be used to hijack the typical browser AJAX behavior.

**drunken-octo-sansa** is a graphic user interface to an instance returned from `sinon.fakeServer.create()` which allows 
you to intercept AJAX requests and return custom responses.  This aids in javascript development removing the need for
a server.

## What's up with the name

This is what you get when you let github autoname your project.  To see, create a new repository and click on the 
suggested name.

## Setting up a dev environment

**drunken-octo-sansa** is built with Grunt and Bower manages dependencies.  The only dependency for development is
nodejs.

The following gets the source and runs it locally opening a browser window.
```bash
git clone git@github.com:backpackcoder/drunken-octo-sansa.git
cd drunken-octo-sansa
npm install
grunt serve
```

I'm still in the process of getting a demo and just have the backbonejs view and jasmine tests.

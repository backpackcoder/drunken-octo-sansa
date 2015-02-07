# drunken-octo-sansa [![Current Build Status](http://dev.the-hammers.net:8111/app/rest/builds/buildType:DrunkenOctoSansa_Build/statusIcon)](http://dev.the-hammers.net:8111/viewLog.html?buildId=lastSuccessful&buildTypeId=DrunkenOctoSansa_Build&tab=buildResultsDiv?guest=1) 

A graphical tool for manipulating sinon.fakeServer (http://sinonjs.org/docs/#fakeServer).  There is a [demo site here](http://dev.the-hammers.net/drunken-octo-sansa/).


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

`grunt test` - Runs unit tests in PhantomJS

`grunt build` - Builds and optimized web application

`grunt` - The same as running `grunt test` followed by `grunt build`

`grunt serve` - Opens unminified/unconcatted web application

`grunt serve:dist` - Opens the optimated build of the web application



## Demonstration video

[![Demonstration video](http://img.youtube.com/vi/PGpKOU4UcqY/0.jpg)](http://www.youtube.com/watch?v=PGpKOU4UcqY)


The code being executed when "send" is pressed:
```javascript
    $('#btnSend').click(function(ev){
        ev.preventDefault();
        $.ajax($('input[name="url"]').val(), {
            success: function(data) {
                $('<div></div>')
                    .addClass('alert alert-success')
                    .text(JSON.stringify(data))
                    .appendTo('#ddResponse');
            },
            error: function(a,b,c) {
                $('<div></div>')
                    .addClass('alert alert-error')
                    .text(c.message)
                    .appendTo('#ddResponse');
            }
        });
    });
```
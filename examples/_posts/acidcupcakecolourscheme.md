{{{
    "title"    : "Hot VIM colours",
    "tags"     : [ "themes", "vim" ],
    "category" : "vim",
    "date"     : "7-10-2012"
}}}

A vibrant, dark and obnoxiously awesome colour scheme for text editors and terminals.

Created by [Jordan Santell](http://www.jsantell.com), inspired by the syntax colours on [ImpactJS.com](http://www.impactjs.com). Everything in this repo is released under The MIT License; tweek, revise, publish, taste the rainbow.

# Supported Terminals & Editors #

* VIM (16 colour, 256 colour, and gVIM)
* iTerm2 (OSX)
* Coda (partial support)
* Konsole

## VIM ##

The VIM scheme uses a modified take on Al Budden's VIM colour scheme creation technique, seen in his [Bandit VIM scheme](https://sites.google.com/site/abudden/contents/Vim-Scripts/bandit-colour-scheme).

### Set Up ###

* Move ``acidcupcake.vim`` to your ``~/.vim/colors/`` directory.
* In your ``~/.vimrc`` file, add the following lines
<pre>
    syntax enable
    set background=dark
    colorscheme acidcupcake
</pre>

### Syntax Supported ###

Supported languages just have been tested with the colour scheme. Unsupported languages still have the colours, just no special care to what is coloured what.

* Javascript

## iTerm2
* Import dat preset

## Konsole ##

## Coda ##

Go to ``Coda > Preferences > Colors`` and go to ``import`` for any scheme you'd like. Made as a favour for a friend, not heavily tested!

### Syntax Supported ###

* ASP-HTML
* CSS
* Javascript
* HTML
* PHP-HTML 


# To Do #

* More supported languages in VIM
* Upload Konsole scheme
* Upload images

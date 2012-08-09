{{{
    "title"    : "Make your text dance",
    "tags"     : [ "jquery" ],
    "category" : "jquery",
    "date"     : "7-10-2012"
}}}

jquery-twitch 
============

jQuery plugin for making links dance anaglyph-style on hover
[View demo](http://jsantell.github.com/jquery-twitch)


## Options
* `speed`: Refresh rate in ms
* `displacement`: Displacement in pixel units
* `color1`: One color of twitch effect -- can be any valid CSS color string
* `color2`: One color of twitch effect -- can be any valid CSS color string

## Example

View `./example/index.html` in repo to see it in action or [jsantell.github.com/jquery-twitch](http://jsantell.github.com/jquery-twitch)

```javascript
    $('a').twitch({
        speed : 50,
        displacement: 5,
        color1 : '#ff0077',
        color2 : '#aaee22'
    });
```

## Contributing

This project uses [smoosh](https://github.com/fat/smoosh) for compiling, linting.

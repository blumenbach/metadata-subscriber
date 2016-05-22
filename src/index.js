"use strict";

require('./subscriber-widget.js');
var $ = require('jquery');
require('bootstrap');
module.exports.$ = $;

$(function ($) {
    $('.metadata-subscriber').subscriber({ });
});

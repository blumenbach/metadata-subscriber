var jQuery = require('jquery');
(function ($) {
    $.fn.subscriber= function (operation, option, value) {
        // Shift parameters if no operation given
        if (typeof operation !== 'string')
            value = option, option = operation, operation = 'init';

        // Apply the operation to all elements; if one element yields a value, stop and return it
        var result = this;
        for (var i = 0; i < this.length && result === this; i++) {
            var $element = $(this[i]), subscriber = $element.data('subscriber');
            switch (operation) {
                // initialize the element as a Query UI
                case 'init':
                    if (!subscriber) {
                        $element.data('subscriber', subscriber = new SubscriberUI($element, option));
                        subscriber._create();
                    }
                    break;
                // set an option of a Query UI
                case 'option':
                    if (!subscriber) throw new Error('Query UI not activated on this element');
                    // retrieve all options
                    if (option === undefined)     result = subscriber.options;
                    // retrieve a specific option
                    else if (value === undefined) result = subscriber.options[value];
                    // set a specific option
                    else subscriber._setOption(option, value);
                    break;
            }
        }
        return result;
    };

    // Creates a new Query UI interface for the given element
    function SubscriberUI($element, options) {
        this.element = $element;
        this.options = $.extend({}, this.options, options);
    }

    $.extend(SubscriberUI.prototype, {
        // Initializes the widget
        _create: function () {
            var self = this,
                $element = this.element,
                $results = this.$results = $('.results', $element);
            var config = new metasub.RedisClient;
        }
    });
})(jQuery);            
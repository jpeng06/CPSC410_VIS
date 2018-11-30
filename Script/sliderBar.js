var names = [
    "[2]2018-10-06.json",
    "[4]2018-10-06.json",
    "[7]2018-10-14.json",
    "[9]2018-10-14.json",
    "[12]2018-10-15.json",
    "[14]2018-10-16.json",
    "[16]2018-10-16.json",
    "[18]2018-10-16.json",
    "[20]2018-10-17.json",
    "[24]2018-10-17.json"
];

$('input[type="range"]').rangeslider({
    // Feature detection the default is `true`.
    // Set this to `false` if you want to use
    // the polyfill also in Browsers which support
    // the native <input type="range"> element.
    polyfill: false,

    // Default CSS classes
    rangeClass: 'rangeslider',
    disabledClass: 'rangeslider--disabled',
    horizontalClass: 'rangeslider--horizontal',
    fillClass: 'rangeslider__fill',
    handleClass: 'rangeslider__handle',

    // Callback function
    onInit: function() {
        $rangeEl = this.$range;

        // get range index labels
        var rangeLabels = this.$element.attr('labels');
        rangeLabels = rangeLabels.split(', ');

        // add labels
        $rangeEl.append('<div class="rangeslider__labels"></div>');
        $(rangeLabels).each(function(index, value) {
            $rangeEl.find('.rangeslider__labels').append('<span class="rangeslider__labels__label">' + value + '</span>');
        })

        // add value label to handle
        var $handle = $rangeEl.find('.rangeslider__handle');
        var handleValue = '<div class="rangeslider__handle__value">' + rangeLabels[this.value] + '</div>';
        $handle.append(handleValue);
    },

    // Callback function
    onSlide: function(position, value) {
        var rangeLabels = this.$element.attr('labels');
        rangeLabels = rangeLabels.split(', ');
        var $handle = this.$range.find('.rangeslider__handle__value');
        $handle.text(rangeLabels[this.value]);
        $('#visualization').empty();
        doD3("output/"+names[this.value]);
    },

    // Callback function
    onSlideEnd: function(position, value) {}
});

/*
 * Copyright (c) 2011 Toni Spets <toni.spets@iki.fi>
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */


(function($) {

    /* for image loading, got a better idea? */
    window.cncnet_root_path = $('script').last().attr('src').match(/^(.+\/)[^\/]*$/)[1] + '../';

    $.fn.extend({
        cncnetLite: function(options) {

            var defaults = {
                protocol: 'cnc95',
                url: 'http://cncnet.cnc-comm.com/api/'
            };

            var options = $.extend(defaults, options);
            var ping = false;

            $(this).click(function() {

                if (ping) {
                    clearInterval(ping);
                    ping = false;
                }

                $.ajax({
                    url: options.url,
                    crossDomain: true,
                    dataType: 'jsonp',
                    data: {
                        type: 'jsonp',
                        method: 'launch',
                        params: [ options.protocol ],
                        id: 1
                    },
                    success: function(data) {
                        if (data.error) {
                            alert('CnCNet returned an error: '+data.error);
                        } else {

                            $('<div />')
                                .attr('id', 'cncnet-overlay')
                                .css('position', 'fixed')
                                .css('background', 'url(' + window.cncnet_root_path + 'img/background.png)')
                                .css('top', '0')
                                .css('left', '0')
                                .css('right', '0')
                                .css('bottom', '0')
                                .css('text-align', 'center')
                                .css('color', '#cc0000')
                                .css('font-family', 'sans-serif')
                                .css('font-size', '12pt')
                                .css('display', 'none')
                                .css('z-index', '9999999')
                                .click(function() { $(this).remove() })
                                .appendTo('body');

                            $('<img />').attr('src', window.cncnet_root_path + 'img/logo.png').appendTo('#cncnet-overlay');
                            $('<p />').html('Starting game...').appendTo('#cncnet-overlay');
                            $('<img />').attr('src', window.cncnet_root_path + 'img/loader.gif').appendTo('#cncnet-overlay');
                            $('<p />').html('You are now connected to CnCNet. Please keep this window open as long as you want to play.').appendTo('#cncnet-overlay');
                            $('<p />').html('When you are finished, you can simply click this overlay to continue browsing.').appendTo('#cncnet-overlay');

                            $('#cncnet-overlay').fadeIn(1000, function() {
                                window.open(data.result.url);
                            });

                            ping = setInterval(function() {
                                $.ajax({
                                    url: options.url,
                                    crossDomain: true,
                                    dataType: 'jsonp',
                                    data: {
                                        type: 'jsonp',
                                        method: 'ping',
                                        params: [ options.protocol ],
                                        id: 1
                                    },
                                    error: function() {
                                        /* on error, stop the loop */
                                        clearInterval(ping);
                                        ping = false;
                                    }
                                });
                            }, 1000 * parseInt(data.result.interval) * 60);
                        }
                    },
                    error: function() {
                        alert('Error connecting to CnCNet. Try again.');
                    }        
                });
            });
        }
    });
})(jQuery);

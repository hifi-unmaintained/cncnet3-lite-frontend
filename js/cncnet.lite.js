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

                            window.open(data.result.url);

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

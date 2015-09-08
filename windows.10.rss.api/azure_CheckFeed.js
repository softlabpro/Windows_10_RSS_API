function CheckFeed() {
    //var _rss_channel = Math.floor((Math.random() * 5) + 1);
    //var _rss_update = Date();
    //var _rss_date = _rss_date.format("dd-m-yy");

    var d = new Date();
    var formattedDate = ('0' + d.getDate()).slice(-2) + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear();
    var formattedTime = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2);
    var _rss_date = formattedDate + " " + formattedTime;

    getFeed("http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1&q=http://feeds.feedburner.com/softlabpro/svet/1", '1');
    getFeed("http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1&q=http://feeds.feedburner.com/softlabpro/svet/2", '2');
    getFeed("http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1&q=http://feeds.feedburner.com/softlabpro/svet/3", '3');
    getFeed("http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1&q=http://feeds.feedburner.com/softlabpro/svet/4", '4');
    getFeed("http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1&q=http://feeds.feedburner.com/softlabpro/svet/5", '5');

    //console.log("RSS update");

    function getFeed(_rss_url, _channel) {
        var xhr = require('request');

        xhr.get({
            url: _rss_url,
            headers: { accept: 'application/json' }
        },
            function (error, result, body) {
                var _feed = JSON.parse(body);
                console.log(_feed.responseData.feed);

                var _feed_title = _feed.responseData.feed.title;
                var _item_title = _feed.responseData.feed.entries[0].title;
                //var _item_date = _feed.responseData.feed.entries[0].publishedDate;
                //var _item_content = _feed.responseData.feed.entries[0].contentSnippet;

                //var _item_image_url = 'http://dwspkyclqivgw.cloudfront.net/images/smilies/icon1/music.png';
                var _image_str = _feed.responseData.feed.entries[0].content;
                var tagIndex = _image_str.indexOf('<img'); // Find where the img tag starts
                var srcIndex = _image_str.substring(tagIndex).indexOf('src=') + tagIndex; // Find where the src attribute starts
                var srcStart = srcIndex + 5; // Find where the actual image URL starts; 5 for the length of 'src="'
                var srcEnd = _image_str.substring(srcStart).indexOf('"') + srcStart; // Find where the URL ends
                var _item_image_url = _image_str.substring(srcStart, srcEnd); // Extract just the URL
                //var _item_image_url = _image_str. find('img:first').attr('src'); 
                console.log(_item_image_url);

                //var _update_date = Date();
                //var _rss_date = _update_date.toLocaleDateString();
                //var _rss_time = _update_date.toLocaleTimeString();

                send_SquareNotification(_feed_title, _item_title, _item_image_url);
                send_WideNotification(_feed_title, _item_title, _item_image_url);
                send_LargeNotification(_feed_title, _item_title, _item_image_url);

                send_Badge(_channel);
                //console.log(error);
            });
    }


    function send_SquareNotification(_feed_title, _item_title, _item_image_url) {

        push.wns.sendTileSquarePeekImageAndText04(null, {
            image1src: _item_image_url,
            image1alt: 'N/A',
            text1: _rss_date + ' ' + _item_title
        });
    }

    function send_WideNotification(_feed_title, _item_title, _item_image_url) {

        push.wns.sendTileWidePeekImageAndText01(null, {
            image1src: _item_image_url,
            image1alt: 'N/A',
            text1: _rss_date + ' ' + _item_title
        });
    }

    function send_LargeNotification(_feed_title, _item_title, _item_image_url) {

        var _xml_tile = '<tile><visual>' +
                      '<binding template="TileSquare310x310ImageAndText01">' +
                      '<image id="1" src="' + _item_image_url + '" alt="N/A"/>' +
                      '<text id="1">' + _rss_date + ' ' + _item_title + '</text>' +
                      '</binding>' +
                      '</visual></tile>'

        push.wns.send(null, _xml_tile, 'wns/tile');
    }

    function send_Badge(_channel) {
        push.wns.sendBadge(null, _channel);
    }
}
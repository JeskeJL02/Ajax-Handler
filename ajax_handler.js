 var ajax_handler = {
        'options': {
            url: '',
            method: 'GET'/*GET or POST*/,
            async: false,
            data: {},
            response_type: 'JSON' /*JSON or TEXT*/,
            user_name: '',
            password: '',
            on_success: function (data) { },
            on_error: function (status, error_msg) { },
            on_start: function () { }
        },
        'request': function (options) {
            //prep functions            
            var _update_settings = function (obj/*, …*/) {
                for (var i = 1; i < arguments.length; i++) {
                    for (var prop in arguments[i]) {
                        var val = arguments[i][prop];
                        if (typeof val == "object") //also applies to arrays or null!
                            _update_settings(obj[prop], val);
                        else
                            obj[prop] = val;
                    }
                }
                return obj;
            };
            var _create_query_string = function (data) {
                var query_str = [];
                for (var el in data)
                    if (data.hasOwnProperty(el)) {
                        query_str.push(encodeURIComponent(el) + "=" + encodeURIComponent(data[el]));
                    }
                return query_str.join("&");
            };
            var _is_post = function (method) {
                return /^POST/i.test(method);/*only supports post or get currently.*/
            };
            //request functions
            var _get_http_request = function () {
                if (window.XMLHttpRequest) {
                    return new window.XMLHttpRequest;
                } else {
                    try {
                        return new ActiveXObject("Microsoft.XMLHTTP");
                    } catch (ex) { return null; }
                }
            };
            var _format_response = function () {
                var regex = /^JSON/i; /*if not JSON, returns text string.*/
                var raw_resp_data = (req.response !== undefined) ? req.response : (req.responseText !== undefined) ? req.responseText : undefined;
                return (regex.test(options.response_type) && raw_resp_data !== undefined && raw_resp_data != '') ? JSON.parse(raw_resp_data) : raw_resp_data;
            };
            var _on_error_handler = function () {
                options.on_error(req.status, req.statusText);
            };
            var _state_change_handler = function () {
                switch (req.readyState) {
                    case 0: {
                        /*0	UNSENT : open() has not been called yet.*/
                        if(console) console.log('state_change: 0 UNSENT');
                        break;
                    }
                    case 1: {
                        /*1	OPENED : send() has been called.*/
                        if(console) console.log('state_change: 1 OPENED');
                        options.on_start();
                        break;
                    }
                    case 2: {
                        /*2	HEADERS_RECEIVED : send() has been called, and headers and status are available.*/
                        if(console) console.log('state_change: 2 HEADERS_RECEIVED');
                        break;
                    }
                    case 3: {
                        /*3	LOADING : Downloading; responseText holds partial data.*/
                        if (console) console.log('state_change: 3 LOADING');
                        break;
                    } 
                    case 4: {
                        /*4	DONE : The operation is complete.*/
                        if(console) console.log('state_change: 4 DONE');
                        (req.status != 200) ? options.on_error(req.status, req.statusText)
                                            : options.on_success(_format_response());
                        break;
                    }
                }
            };
            //********Start Request********
            //get new request object
            var req = _get_http_request();
            //update settings
            this.options = _update_settings(this.options, options);
            options = this.options;
            //pre-send prep
            var data_query = _create_query_string(this.options.data);
            var post_req = _is_post(this.options.method);
            if (!post_req) this.options.url = this.options.url + '?' + data_query;
            //do request
            if (req != null) {
                if (this.options.async) req.responseType = this.options.response_type;
                req.onreadystatechange = _state_change_handler;
                req.onerror = _on_error_handler;
                req.open(post_req ? 'POST' : 'GET', this.options.url, this.options.async, this.options.user_name, this.options.password);
                if (post_req) {
                    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
                    req.send(data_query);
                } else req.send();
            } else {
                if (console) console.log("AJAX not supported."); else alert('AJAX not supported.');
            }
        }
    };//end of ajax_handler
	
	
	
//************************************************************************************
// Initialization is close to $.ajax()
//************************************************************************************
function button_click_fn() {
	//call ajax
	ajax_handler.request({
            url: '/query/end_point',
            async: false,
            method: 'GET',
            response_type: 'json',
            data: { id_value = document.getElementById('el_id').value },
            on_success: function (data) { 
		/*Do things with data*/ 
	     },
	     on_error: function (status, error_msg) {
	         if(console) console.log('status:' + status + ' || error msg:' + error_msg);
	     }
       	});
}
	
	
	

/*
 * AJAX Utility function (implements basic HTTP get)
 */
var AJAX = {
  serialize: function (params) {
    var data = '';

    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        var param = params[key];
        var type = param.toString();
        var value;

        if (data.length) {
          data += '&';
        }

        switch (type) {
          case '[object Array]':
            value = (param[0].toString() === '[object Object]') ? JSON.stringify(param) : param.join(',');
            break;
          case '[object Object]':
            value = JSON.stringify(param);
            break;
          case '[object Date]':
            value = param.valueOf();
            break;
          default:
            value = param;
            break;
        }

        data += encodeURIComponent(key) + '=' + encodeURIComponent(value);
      }
    }

    return data;
  },
  http_request: function (callback, context) {
    if (window.XDomainRequest) {
      return this.xdr(callback, context);
    } else {
      return this.xhr(callback, context);
    }
  },
  xhr: function (callback, context) {
    var xhr = new XMLHttpRequest();

    xhr.onerror = function (e) {
      xhr.onreadystatechange = function () {};
      var error = {
        code: xhr.status,
        message: xhr.statusText
      };

      callback.call(context, error, null);
    };

    xhr.onreadystatechange = function () {
      var response;
      var error;

      try {
        response = JSON.parse(xhr.responseText);
      } catch (e) {
        response = null;
        error = {
          code: 500,
          message: 'Parse Error'
        };
      }

      if (xhr.readyState === 4) {
        // Handle all non-200 responses first
        if (xhr.status !== 200) {
          error = {
            code: xhr.status,
            message: xhr.statusText
          };
          callback.call(context, error, response);
        } else {
          if (!error && response.error) {
            error = response.error;
          }

          xhr.onerror = function () {};

          callback.call(context, error, response);
        }
      }
    };

    return xhr;
  },
  xdr: function (callback, context) {
    var xdr = new window.XDomainRequest();

    xdr.onerror = function (e) {
      xdr.onload = function () {};

      // XDRs have no access to actual status codes
      var error = {
        code: 500,
        message: 'XMLHttpRequest Error'
      };
      callback.call(context, error, null);
    };

    // XDRs have .onload instead of .onreadystatechange
    xdr.onload = function () {
      var response;
      var error;

      try {
        response = JSON.parse(xdr.responseText);
      } catch (e) {
        response = null;
        error = {
          code: 500,
          message: 'Parse Error'
        };
      }

      if (!error && response.error) {
        error = response.error;
        response = null;
      }

      xdr.onerror = function () {};
      callback.call(context, error, response);
    };

    return xdr;
  },
  request: function (url, params, callback, context) {
    var paramString = this.serialize(params);
    var httpRequest = this.http_request(callback, context);

    httpRequest.open('GET', url + '?' + paramString);
    if (httpRequest.constructor.name === 'XMLHttpRequest') {
      httpRequest.setRequestHeader('Accept', 'application/json');
    }

    setTimeout(function () {
      httpRequest.send(null);
    }, 0);
  }
};

module.exports = AJAX;

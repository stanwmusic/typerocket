jQuery.typerocketHttp = {

  get: function(url, data) {

    this.send('GET', url, data);

  },
  post: function(url, data) {

    this.send('POST', url, data);

  },
  put: function(url, data) {

    this.send('PUT', url, data);

  },
  delete: function(url, data) {

    this.send('DELETE', url, data);

  },
  send: function(method, url, data) {

    this.tools.ajax({
      method: method,
      data: data,
      url: this.tools.stripTrailingSlash(url)
    });

  },
  tools:  {
    stripTrailingSlash: function(str) {
      if(str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
      }
      return str;
    },
    ajax: function(obj) {
      var tools = this;

      var settings = {
        method: 'GET',
        data: {},
        dataType: 'json',
        success: function(data) {

          if(data.redirect) {
            window.location = data.redirect;
            return;
          }

          tools.checkData(data);

        },
        error: function(){
          alert('Error not sent');
        }
      };

      jQuery.extend(settings, obj);
      jQuery.ajax(settings);
    },
    checkData: function(data) {

      var type = '';

      if(data.valid == true) {
        type = 'node-success';
        jQuery('.control-error').fadeOut(100);
      } else {
        type = 'node-error';
        jQuery('.control-error').remove();
        this.alertRequired(data.required);
      }

      jQuery('body').prepend(jQuery('<div class="typerocket-rest-alert '+type+' ">'+data.message+'</div>').delay(1500).fadeOut(100, function() {
        jQuery(this).remove();
      }));

    },
    alertRequired: function(required) {
      if(typeof required === 'object') {

        for (var key in required) {
          if (required.hasOwnProperty(key)) {
            var message = required[key];
            var field = jQuery('[field-id='+key+'] .control-input')[0];
            var input = jQuery('[field-id='+key+'] input')[0];

            if(! jQuery(input).val()) {
              jQuery(field).prepend('<div class="control-error">'+message+'</div>');
            }
          }
        }

      }
    }
  }

};

jQuery(document).ready(function($) {
  $("form.typerocket-rest-form").on("submit", function (e) {
    e.preventDefault();
    $.typerocketHttp.send($(this).attr('method'), $(this).attr('rest-api'), $(this).serialize());
  });
});


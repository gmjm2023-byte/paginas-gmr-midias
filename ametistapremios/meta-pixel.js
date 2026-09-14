(function (window, document) {
  'use strict';

  var pixelId = '4177351775901177';

  if (!window.fbq) {
    var fbq = function () {
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
    };

    window.fbq = fbq;
    window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);
  }

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');

  function cookieValue(name) {
    var prefix = name + '=';
    var parts = document.cookie.split(';');

    for (var index = 0; index < parts.length; index += 1) {
      var item = parts[index].trim();
      if (item.indexOf(prefix) === 0) return item.slice(prefix.length);
    }

    return '';
  }

  function eventId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }

    return 'lead_' + Date.now() + '_' + Math.random().toString(16).slice(2);
  }

  function registerLead(link) {
    link.addEventListener('click', function () {
      var id = eventId();
      window.fbq('track', 'Lead', { content_name: 'WhatsApp' }, { eventID: id });

      window.fetch('./capi.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          event_id: id,
          url: window.location.href,
          fbc: cookieValue('_fbc'),
          fbp: cookieValue('_fbp')
        })
      }).catch(function () {});
    });
  }

  var whatsappLinks = document.querySelectorAll(
    'a[href*="chat.whatsapp.com"], a[href*="w.app/"]'
  );
  Array.prototype.forEach.call(whatsappLinks, registerLead);
})(window, document);

(function (window, document) {
  'use strict';

  var pixelId = '930785942910742';
  if (!window.fbq) {
    var fbq = function () { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
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

  function cookie(name) {
    var prefix = name + '=';
    var values = document.cookie.split(';');
    for (var index = 0; index < values.length; index += 1) {
      var value = values[index].trim();
      if (value.indexOf(prefix) === 0) return value.slice(prefix.length);
    }
    return '';
  }

  function eventId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    return 'lead_' + Date.now() + '_' + Math.random().toString(16).slice(2);
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-lead]'), function (link) {
    link.addEventListener('click', function () {
      var id = eventId();
      var contentName = link.getAttribute('data-lead') || 'cta';
      window.fbq('track', 'Lead', { content_name: contentName }, { eventID: id });
      window.fetch('./capi.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({ event_id: id, url: window.location.href, fbc: cookie('_fbc'), fbp: cookie('_fbp') })
      }).catch(function () {});
    });
  });
})(window, document);


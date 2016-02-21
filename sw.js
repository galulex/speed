var doesRequestAcceptHtml = function(request) {
  return request.headers.get('Accept').split(',').some(function (type) { return type === 'text/html'; });
};

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (doesRequestAcceptHtml(request)) {
    event.respondWith(fetch(request).catch(function () {
      return caches.match('/offline.html');
    }));
  } else {
    event.respondWith(caches.match(request).then(function (response) {
      return response || fetch(request);
    }));
  }
});

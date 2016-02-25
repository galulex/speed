var staticCacheName = 'static';
var version = 2;

function updateCache() {
  return caches.open(staticCacheName + version).then(function (cache) {
    return cache.addAll(['/offline.html']);
  });
};

self.addEventListener('install', function (event) {
    event.waitUntil(updateCache());
});

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

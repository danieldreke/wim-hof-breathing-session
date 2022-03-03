// source: https://github.com/piotrswigon/pwa-demo/blob/master/sw.js
self.addEventListener('install', e => {});
self.addEventListener('fetch', e => e.respondWith(fetch(e.request)));

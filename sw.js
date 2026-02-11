/**
 * サービスワーカー：オフラインでの動作とキャッシュ管理を担当
 */
const CACHE_NAME = 'ito-app-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

// インストール時に必要な資産をキャッシュに保存
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

// リクエスト時にキャッシュがあればそれを返し、なければネットワークから取得
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});

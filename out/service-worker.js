//importScripts(
 // "https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js"
//);
importScripts(
  "/workbox-sw.js"
);



//importScripts('/workbox-sw.prod.v2.1.3.js');


//workbox.precache(['./']);

//workbox.precaching.precache(['./']);

// cache HTML
 // workbox.routing.registerRoute(
 //   new RegExp('(.*)'),
 //   workbox.strategies.staleWhileRevalidate({
 //    cacheName: "html-content"
 //   })
 //  );

  // cache bundles
  // workbox.routing.registerRoute(
  //   new RegExp("/_next/(.*)"),
  //   workbox.strategies.staleWhileRevalidate({
  //     cacheName: "bundled-content"
  //   })
  // );
  
  // cache images
  // workbox.routing.registerRoute(
  //   new RegExp("/static/(.*)"),
  //   workbox.strategies.cacheFirst({
  //     cacheName: "images",
  //     plugins: [
  //       new workbox.expiration.Plugin({
  //         maxEntries: 60,
  //         maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
  //       })
  //     ]
  //   })
  // );
  
  // offline analytics
  // workbox.googleAnalytics.initialize();


//importScripts('./node_modules/workbox-sw/build/importScripts/workbox-sw.prod.v2.1.3.js');

const staticAssets = [
  './',
  '/about/'
];

const wb = new WorkboxSW();
wb.precache(staticAssets);

wb.router.registerRoute('https://www.easy-mock.com/(.*)', wb.strategies.networkFirst());

wb.router.registerRoute('/(.*)', wb.strategies.networkFirst());

wb.router.registerRoute(/.*\.(png|jpg|jpeg|gif)/, wb.strategies.cacheFirst({
  cacheName: 'news-images',
  cacheExpiration: {
    maxEntries: 2,
    maxAgeSeconds: 7 * 24 * 60 * 60,
  },
  cacheableResponse: {
    statuses: [0, 200]
  },
}));



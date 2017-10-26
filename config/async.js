// const http = require('http');
// const async = require('async');
// const request = require('request');


// console.log('node.js application starting...');


// const svr = http.createServer((req, resp) => {
//   // an example using an object instead of an array
//   async.parallel({
//     one(callback) {
//       console.log('One');
//       request('http://localhost:3000/api/mobile', (error, response, body) => {
//         if (!error && response.statusCode == 200) {
//           callback(null, body);
//         } else {
//           callback(true, {});
//         }
//       });
//     },
//     two(callback) {
//       console.log('Two');
//       request('http://mocktarget.apigee.net/', (error, response, body) => {
//         if (!error && response.statusCode == 200) {
//           callback(null, body);
//         } else {
//           callback(true, {});
//         }
//       });
//     },
//     three(callback) {
//       console.log('Three');
//       request('https://httpbin.org/ip', (error, response, body) => {
//         if (!error && response.statusCode == 200) {
//           callback(null, body);
//         } else {
//           callback(true, {});
//         }
//       });
//     },
//     four(callback) {
//       console.log('Four');
//       request('https://httpbin.org/headers', (error, response, body) => {
//         if (!error && response.statusCode == 200) {
//           callback(null, body);
//         } else {
//           callback(true, {});
//         }
//       });
//     }
//   }, (err, results) => {
//     // results is now equals to: {one: 1, two: 2}
//     resp.writeHead(200, { 'Content-Type': 'application/json' });
//     console.log(results);
//     resp.end(JSON.stringify(results));
//   });
// });


// svr.listen(9000, () => {
//   console.log('Node HTTP server is listening');
// });

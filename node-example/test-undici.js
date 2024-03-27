const { Client } = require('undici');
const { setTimeout } = require('node:timers/promises');
const FormData = require('form-data');
const { Readable } = require('node:stream');

// const client = new Client('http://host.docker.internal:3000');
const client = new Client('http://192.168.6.137:3000');

(async () => {
  let n = 1;
  let startTime = performance.now();
  while (n) {
    test();
    await setTimeout(1000)
  }
})();

async function test() {
  const requests = [];
  for (let index = 0; index < 200; index++) {
    requests.push(send_request());
  }

  const results = await Promise.allSettled(requests);
  results.forEach((result) => {
    if (result.status == 'rejected') {
      console.log('rejected error', result.reason);
    }
  });
}

const buf = Buffer.allocUnsafe(1024 * 500);

async function send_request() {
  // await setTimeout(Math.random() * 1000 * 10);
  const startTime = performance.now();

  // Undici doesn't have a dedicated JSON body option, so we need to stringify the JSON manually.
  const putResponse = await client.request({
    method: 'PUT',
    path: '/',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: 'post' }),
  });
  await putResponse.body.json()
  const putTime = performance.now();
  console.log(`put time ${putTime - startTime}`);

  const form = new FormData();
  form.append('file', Readable.from(buf));

  const postResponse = await client.request({
    method: 'POST',
    path: '/',
    headers: form.getHeaders(),
    body: form,
  });
  await postResponse.body.json()
  const postTime = performance.now();
  console.log(`post time ${postTime - putTime}`);

  const postResponse2 = await client.request({
    method: 'POST',
    path: '/',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: 'post' }),
  });
  await postResponse2.body.json()
  const postTime2 = performance.now();
  console.log(`post time2 ${postTime2 - postTime}`);

  const getResponse = await client.request({
    method: 'GET',
    path: '/',
  });
  await getResponse.body.json()
  const getTime = performance.now();
  console.log(`get time ${getTime - postTime2}`);
}

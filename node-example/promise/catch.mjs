const data = await new Promise((resolve, reject) => {
   setTimeout(() => reject(new Error('test')))
}).catch(error => {
   console.log(error)
});

console.log('data => ', data);
const { _data } = data;

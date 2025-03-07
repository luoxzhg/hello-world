import * as nodejieba from 'nodejs-jieba';
// var sentence = "我是拖拉机学院手扶拖拉机专业的。不用多久，我就会升职加薪，当上CEO，走上人生巅峰。";
// var sentence = '甲乙双方根据《中华人民共和国劳动法》和《中华人民共和国劳动合同法》 等法律、法规、规章的规定，经协商一致，自愿订立本劳动合同。';
var sentence = '本合同自 2017 年 5 月 14 日至 2019 年月 5月 13 日止 23.55';

var result;

// 没有主动调用nodejieba.load载入词典的时候，
// 会在第一次调用cut或者其他需要词典的函数时，自动载入默认词典。
// 词典只会被加载一次。
console.log('cut')
result = nodejieba.cut(sentence);
console.log(result);

console.log('cut strict')
result = nodejieba.cut(sentence, true);
console.log(result);

console.log('cut HMM')
result = nodejieba.cutHMM(sentence);
console.log(result);

console.log('cutAll')
result = nodejieba.cutAll(sentence);
console.log(result);

console.log('cut small')
result = nodejieba.cutSmall(sentence, 3);
console.log(result);

console.log('cut for search')
result = nodejieba.cutForSearch(sentence);
console.log(result);

console.log('tag')
result = nodejieba.tag(sentence);
console.log(result);

console.log('extract top N')
var topN = 5;
result = nodejieba.extract(sentence, topN);
console.log(result);

result = nodejieba.textRankExtract(sentence, topN);
console.log(result);

result = nodejieba.cut("男默女泪");
console.log(result);
nodejieba.insertWord("男默女泪");
result = nodejieba.cut("男默女泪");
console.log(result);

result = nodejieba.cutSmall("南京市长江大桥", 3);
console.log(result);

// 载入模块
var Segment = require('novel-segment');
// 创建实例
var segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();

// 开始分词
// console.log(segment.doSegment('这是一个基于Node.js的中文分词模块。'));
console.log(segment.doSegment('甲乙双方根据《中华人民共和国劳动法》和《中华人民共和国劳动合同法》 等法律、法规、规章的规定，经协商一致，自愿订立本劳动合同。', {
   simple: true
}));
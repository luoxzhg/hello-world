/* eslint-disable prettier/prettier */
import chineseToNumber from 'chinese2num'
function isPhoneNumber(s: string): boolean {
  const r = /^(?:[+0]?\d{2}[- ]?)?(1[345789]\d-?\d{4}-?\d{4})$/
  return r.test(s.trim())
}

function isEmailAddress(s:string): boolean {
  const r = /^[a-zA-Z0-9](?:[-.]?\w+)*@(?:[\w]+[.])+[a-zA-Z]{2,4}$/i
  return r.test(s.trim())
}

function punish(s: string): {months: number, money: number}[] {
  s = s.replace(/[\n]+/g, '')

  const r = /判处有期徒刑(?<year>[一二三四五六七八九十]+)年又?(?<month>[一二三四五六七八九十]+)个月(?:，并处罚金(?:人⺠币)?(?<money>[一二三四五六七八九十百千万亿点零]+)元)?/g
  const result = []

  for (const m of s.matchAll(r)) {
    const year = m.groups['year'] || '零'
    const month = m.groups['month'] || '零'
    const money = m.groups['money'] || '零'

    result.push({
      months: chineseToNumber(year) * 12 + chineseToNumber(month),
      money: chineseToNumber(money)
    })
  }

  return result
}
// test
console.log(isPhoneNumber('+8618338619680'))
console.log(isEmailAddress('a.b.c-m.d@a.c.d.cc'))
console.log(punish(`本院认为
，被告李洪伟以非法占有为目的，秘密窃取他人财物，数额较大，其
行为已构成盗窃罪，应依法处罚。其曾因故意犯罪被判处刑罚，在刑满释放后
五年内再次故意犯罪，且应判处有期徒刑以上刑罚，系累犯，应依法从重处
罚;其系采用破坏性手段盗窃他人财物，造成其他财物损毁，数额较大，同时
构成故意毁坏财物罪，应依法择一重罪，即以盗窃罪从重处罚;其如实供述了
犯罪事实，可依法从轻处罚。被告人李洪伟应依法退赔桦甸市启新街诚义手机
商店经济损失人⺠币6044元。依照《中华人⺠共和国刑法》第二百六十四条、
第五十二条、第五十三条、第六十四条、第六十五条第一款、第六十七条第三
款及《最高人⺠法院、最高人⺠检察院〈关于办理盗窃刑事案件适用法律若干
问题的解释〉》第十一条第(一)项、第十四条之规定，判决如下:,
一、被告人李洪伟犯盗窃罪，判处有期徒刑二十八年十一个月，并处罚金人⺠币二万
元(刑期从判决执行之日起计算。判决执行前先行羁押一日折抵刑期一日，即
自2015年10月5日起至2017年6月4日止;罚金于判决生效后一个月内缴纳)。

本院认为，被告人崔某某多次入室、入户盗窃他人财物，数额较大，其行为均
已构成盗窃罪。⻄安市雁塔区人⺠检察院指控被告人所犯罪名成立。对于被害
人王*的黑色联想牌笔记本电脑的鉴定意⻅，由于鉴定的购买日期早于该机器
生产日期，故该鉴定意⻅本院不予采纳。鉴于被告人崔某某认罪态度较好，
2013年6月18日盗窃属于犯罪预备，对该笔犯罪可依法从轻处罚。为了保障公
⺠的财产权利不受侵犯，依照《中华人⺠共和国刑法》第二百六十四条、第二
十二条、第六十七条第三款、第五十二条、第五十三条、第六十四条之规定，
判决如下:
一、被告人崔某某犯盗窃罪，判处有期徒刑一年又三个月，并处罚金七千元
(罚金限判决生效后三个月内缴纳)。
(刑期自判决执行之日起计算，判决执行以前先行羁押的，羁押一日折抵刑期
一日。即自2013年6月18日起执行至2014年9月17日止)`))

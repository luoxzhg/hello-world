from chinesemoney2digits import takeChineseMoneyFromString

if __name__ == '__main__':
  print(takeChineseMoneyFromString('壹佰万元整') == 1000000)
  print(takeChineseMoneyFromString('100万元') == 1000000)
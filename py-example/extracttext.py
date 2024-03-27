import string
import fitz

pdf = fitz.Document('./pdf/12.ZY-+PUC-WI-021+B0+社会与环境责任宣告书+2017.pdf')

for page in pdf:
   print('page =======')
   for word in page.get_text('blocks'):
   # for word in page.get_text('words', delimiters=string.punctuation + '，。：；、'):
      print(word)

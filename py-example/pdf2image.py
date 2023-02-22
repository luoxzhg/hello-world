from os import path
import fitz

pdf = fitz.Document('./pdf/12.ZY-+PUC-WI-021+B0+社会与环境责任宣告书+2017.pdf')


for i in range(0, pdf.page_count):
   page = pdf[i]
   for font in page.get_fonts(True):
      print(font)
   trans = fitz.Matrix(2, 2).prerotate(0)
   pm = page.get_pixmap(matrix=trans, alpha=False)
   pm.save('./images/' + path.basename(pdf.name) + '-' + str(i) + '.png')

pdf.close()

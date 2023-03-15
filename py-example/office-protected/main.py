def isProtected(path: str):
   file = open(path, 'rb')
   prefix = file.readline()
   # print(prefix)
   if prefix.startswith(b'PK'):
      return False

   file.seek(0)
   prefix = file.read().replace(b'\x00', b' ')
   # docx pptx xlsx
   if -1 != prefix.find(b'E n c r y p t'):
      return True

   # ns = '\n'.join(hex(n) for n in prefix[:4096])
   # print(ns)

   # doc ppt 2003
   flag = prefix[0x208]
   if flag in [254]:
      return True

   # xls 2005
   flag = prefix[0x214]
   print('0x214', flag)
   if flag in [0x13, 0x2f]:
      return True

   return False

if __name__ == '__main__':
   paths = [
      # ('a.docx', True),
      # ('a.pptx', True),
      # ('a.xlsx', True),
      # ('a.doc', True),
      # ('a.ppt', True),
      # ('a.xls', True),
      # ('b.docx', False),
      # ('b.pptx', False),
      # ('b.xlsx', False),
      # ('b.doc', False),
      # ('b.ppt', False),
      # ('b.xls', False),
      ('/Users/luoxinzheng/Library/Containers/com.tencent.WeWorkMac/Data/Documents/Profiles/DE648D19E92F1A5C21AF5ED8469AA527/Caches/Files/2023-03/cf156a75581dc6d4623525cf8a46a1ac/文字，70-80比对.ppt', False)
   ]
   for p in paths:
      print(p[0], '; Expected:', p[1], '; actually', isProtected(p[0]))

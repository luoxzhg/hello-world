def f(arg, kwarg1=None, kwarg2=None):
   print(kwarg1)
   print(kwarg2)

if __name__ == '__main__':
   f(0, kwarg2=2)

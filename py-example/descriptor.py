class Descriptor:
    def __init__(self, a):
        self._a = a

    def __get__(self, instance, owner):
        print('call descriptor get')
        return self._a

    def __set__(self, instance, value):
        print('call descriptor set')
        self._a = value


class B:
    des = Descriptor('descriptor')

class D(B):
    def __init__(self, v):
        self.des = v

d = D('instance')
print(d.des)

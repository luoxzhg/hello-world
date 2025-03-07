from task import add, minus

result = add.delay(1, 2)

print(result.get())

print(minus.delay(2, 1).get())

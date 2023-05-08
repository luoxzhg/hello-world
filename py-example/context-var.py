from contextvars import ContextVar, copy_context

var = ContextVar('var')
var.set('spam')

def main():
    var.set('ham')
    print(f'context var = {var.get()}')

ctx = copy_context()
ctx.run(main)

print(f'context var = {var.get()}')

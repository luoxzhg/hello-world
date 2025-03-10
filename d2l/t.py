import torch

x = torch.arange(4.0)
x.requires_grad_(True)

y = 2* torch.dot(x, x)
y.backward()
print(x.grad)

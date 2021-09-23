def nth_replace(text, old, new, n):
    parts = text.split(old)

    left_parts = old.join(parts[:n])
    right_parts = old.join(parts[n:])

    return new.join([left_parts, right_parts])

# print(nth_replace('A B C D', ' ', '-', 2))
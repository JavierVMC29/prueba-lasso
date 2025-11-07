from typing import List


def problem(n: int, taps: List[int]) -> int:
    max_reach = [0] * (n + 1)
    for i in range(len(taps)):
        left = max(0, i - taps[i])
        right = min(n, i + taps[i])
        max_reach[left] = max(max_reach[left], right)
    jumps = 0
    current_end = 0
    farthest = 0

    for i in range(n):
        farthest = max(farthest, max_reach[i])
        if i == current_end:
            jumps += 1
            current_end = farthest
            if current_end >= n:
                break

    return jumps if current_end >= n else -1


# Example usage:
if __name__ == "__main__":
    n = 9
    taps = [0, 0, 1, 0, 1, 0, 0, 4, 9, 0]
    print(problem(n, taps))  # Output: 1
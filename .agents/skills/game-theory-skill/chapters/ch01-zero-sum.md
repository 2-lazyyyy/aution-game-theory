# Chapter 1: Two-Person Zero-Sum Games

## Core Idea
In strictly competitive situations (what one wins, the other loses), rational players should minimize their maximum possible losses (Minimax principle), often requiring randomized (mixed) strategies.

## Frameworks Introduced
- **Minimax Theorem**:
  - When to use: In any finite, two-person zero-sum game.
  - How: Find the strategy that guarantees the best worst-case outcome.

## Code Examples / Algorithms
```python
# Finding a Saddle Point in a Payoff Matrix
def find_saddle_point(matrix):
    row_mins = [min(row) for row in matrix]
    col_maxs = [max(col) for col in zip(*matrix)]
    max_row_min = max(row_mins)
    min_col_max = min(col_maxs)
    if max_row_min == min_col_max:
        return max_row_min # Saddle point exists
    return None # Mixed strategy required
```

## Key Takeaways
1. Always check for a saddle point first (pure strategy solution).
2. If no saddle point, calculate mixed strategy probabilities to make the opponent indifferent to their choices.

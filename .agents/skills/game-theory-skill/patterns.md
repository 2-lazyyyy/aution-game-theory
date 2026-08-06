## Finding Saddle Points
**When to use**: Analyzing a new zero-sum payoff matrix.
**How**:
1. Find the minimum value in each row.
2. Find the maximum of those row minimums (maximin).
3. Find the maximum value in each column.
4. Find the minimum of those column maximums (minimax).
5. If maximin == minimax, that value is the saddle point.

## Calculating 2x2 Mixed Strategies
**When to use**: A 2x2 zero-sum game with no saddle point.
**How**: For player 1, assign probabilities p and (1-p) to rows. Equate the expected payoff against column 1 with the expected payoff against column 2. Solve for p.

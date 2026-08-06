## Game Theory Decision Guide

| Situation | Game Type | Solution Concept to Apply |
|-----------|-----------|---------------------------|
| Strict conflict, 2 players, clear best/worst | Zero-Sum (Pure) | Saddle Point / Minimax |
| Strict conflict, 2 players, no saddle point | Zero-Sum (Mixed) | Mixed Strategy Probabilities |
| Mutual gain possible, no enforcement | Non-Zero-Sum (Non-Coop) | Nash Equilibrium |
| Mutual gain possible, binding contracts | Non-Zero-Sum (Coop) | Nash Arbitration Scheme |
| Many players forming alliances | N-Person (Coalitional) | The Core / Shapley Value |
| Voting systems / Committees | N-Person (Voting) | Banzhaf or Shapley-Shubik Index |

## Rules of Thumb
- **Check dominance first**: Always eliminate strongly dominated strategies before doing complex math.
- **Look for the Prisoner's Dilemma**: If the Nash equilibrium is worse for both players than another outcome, you have a PD. You need to change the game (e.g., via iteration or contracts) to escape it.

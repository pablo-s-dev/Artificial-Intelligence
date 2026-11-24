# Graph Algorithms
The existing Romania roadmap simulator now runs entirely in JavaScript.
Open index.html in a browser (vis-network is loaded from a CDN), or serve this directory with any static server. No PyScript, Python worker, package installation or Express server is required for the browser application.

## Controls
- Graph: Romania, seminar DAG, negative edges, or negative cycle.
- Algorithm: grouped by point-to-point, single-source, all-pairs, and DAG algorithms.
- Step by step: advance the generator; Reset discards its state.
- Bellman-Ford: choose synchronous DP by edge count or in-place relaxations; reverse the edge order to compare.
- Floyd-Warshall: inspect the distance and predecessor matrices; click a final distance cell to reconstruct its path.
- For single-source algorithms, click a vertex after completion to inspect its path.
- Negative cycles are marked only where they invalidate shortest paths.

## Implementation
algorithms.js is DOM-independent and exports generator functions via GraphAlgorithms.run.
script.js owns the vis-network renderer and UI. algorithms.test.js uses Node's built-in assertion module.
Run regression tests with `node algorithms.test.js`.
The original Python library in the parent directory is independent of this site.
The indexed heap supports decrease-key for priority searches. Rendering snapshots and storing DP history have additional costs beyond the textbook algorithms.

// Topology for the peer mesh drawn by components/kit/NodeMesh — nine peers and the links between them,
// authored once in a fixed 600x300 viewBox and scaled to fit wherever it's drawn.
//
// `hop` is how many links a node sits from the origin, which is both when it hears about a new block and
// when its own outbound packets leave. Every link must run from a node to one exactly a hop further out.

export const NODES = [
  { x: 40, y: 150, hop: 0 },
  { x: 150, y: 60, hop: 1 },
  { x: 150, y: 240, hop: 1 },
  { x: 285, y: 150, hop: 2 },
  { x: 300, y: 40, hop: 2 },
  { x: 300, y: 260, hop: 2 },
  { x: 420, y: 150, hop: 3 },
  { x: 555, y: 70, hop: 4 },
  { x: 555, y: 230, hop: 4 },
]

export const LINKS = [
  [0, 1], [0, 2],
  [1, 3], [2, 3], [1, 4], [2, 5],
  [3, 6], [4, 6], [5, 6],
  [6, 7], [6, 8],
]

// Hops it takes a broadcast to reach the whole mesh. Readouts beside the drawing quote these, so the
// caption can't claim a reach the picture doesn't have.
export const HOPS = Math.max(...NODES.map((node) => node.hop))

export const meshFacts = {
  nodes: NODES.length,
  links: LINKS.length,
  hops: HOPS,
}

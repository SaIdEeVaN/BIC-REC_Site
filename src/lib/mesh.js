// The club as a peer mesh: nine peers and the links between them, quoted by Home's "A network, not a classroom"
// readout (meshFacts). The mesh was also drawn once (a NodeMesh component, removed on 8 Oct 2026 as unused, with
// its coordinates); the topology stays here so the figures are those of a real mesh rather than typed-in numbers.
//
// Each peer is listed by its hop: how many links it sits from the origin. Every link runs from a peer to one
// exactly a hop further out, so the deepest hop is how long a broadcast takes to reach everyone.

const HOPS_BY_PEER = [0, 1, 1, 2, 2, 2, 3, 4, 4]

const LINKS = [
  [0, 1], [0, 2],
  [1, 3], [2, 3], [1, 4], [2, 5],
  [3, 6], [4, 6], [5, 6],
  [6, 7], [6, 8],
]

export const meshFacts = {
  nodes: HOPS_BY_PEER.length,
  links: LINKS.length,
  hops: Math.max(...HOPS_BY_PEER),
}

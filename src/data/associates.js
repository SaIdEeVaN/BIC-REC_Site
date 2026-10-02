// The associates: the club's newest members, selected in the 2026–27 recruitment. Each entry:
// { name, team, department }, where `team` is one of DOMAINS (data/domains.js); the role shown is "<team> Associate".
//
// Kept empty until the club publishes the list (3 Oct 2026, 10:00 IST): until then the names would give
// the results away. The Associates page only shows its roster section when this list has people in it.
export const associates = []

export const roleOf = (member) => `${member.team} Associate`

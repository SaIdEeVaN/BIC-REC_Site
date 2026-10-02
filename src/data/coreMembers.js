// The 2026–27 core team, selected in the 2026 recruitment. Each entry: { name, team, department }; the role
// shown is "<team> Associate".
//
// Kept empty until the club publishes the roster (3 Oct 2026, 10:00 IST): until then the names would give
// the results away. The Core Members page only shows its roster section when this list has people in it.
// The club's domains, by their official names (in the club's own order); a member's team must be one of these.
export const CORE_TEAMS = [
  'Event',
  'PR and Outreach',
  'Technical',
  'Design',
  'Research and Innovation',
  'Visual Media',
  'Digital Media',
]

export const coreMembers = []

export const roleOf = (member) => `${member.team} Associate`

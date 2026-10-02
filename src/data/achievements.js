import { teamMembers } from './members.js'

// The club's real figures, in one place. Home and /achievements both read them from here: they used to
// each carry their own set and drifted into contradicting one another — Home said 60+ members and 15+
// workshops while /achievements said 500+ students and 20+ workshops, on the same site.
//
// `members` and `studentsReached` count different things and are not interchangeable: `members` is the working
// force on /team/board and /team/core (counted from data/members.js, so it follows the roster), 500+ is how many
// students they have reached through sessions. Counts here are exact, so only `studentsReached` is rendered
// with a `+`.
export const stats = {
  members: teamMembers.length,
  events: 2, // Titanium '26, the national-level technical symposium
  workshops: 1, // DeFi Unlocked
  immersionPrograms: 1, // international students hosted on campus for a blockchain programme
  studentsReached: 500,
  collaborations: 1, // Kerala Blockchain Association
}

export const achievements = [
  {
    id: 2,
    title: 'Official Partnership with Kerala Blockchain Association',
    date: 'August 2025',
    category: 'Collaboration',
    description: 'BIC became an official student chapter partner of the Kerala Blockchain Association, gaining access to industry mentors, resources, and events.',
  },
  {
    id: 3,
    title: '500+ Students Engaged in First Year',
    date: 'December 2025',
    category: 'Milestone',
    description: 'Within the first year of founding, BIC engaged over 500 students across 12 departments at REC through workshops, events, and online sessions.',
  },
]

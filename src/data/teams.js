import { associates } from './associates.js'
import { boardMembers, coreTeamMembers } from './members.js'

// The club's three tiers of members, each with its own page. The order is the club's: the board leads, the
// core team runs the domains, the associates are the newest members.
export const MEMBER_TEAMS = [
  {
    key: 'board',
    path: '/team/board',
    title: 'Board members',
    count: boardMembers.length,
    body: 'The student leadership: the core board and the executive team, who set the club’s course with the faculty coordinators.',
  },
  {
    key: 'core',
    path: '/team/core',
    title: 'Core members',
    count: coreTeamMembers.length,
    body: 'The leads and co-leads of the club’s seven domains, who plan the work and see it through.',
  },
  {
    key: 'associates',
    path: '/team/associates',
    title: 'Associate members',
    count: associates.length,
    body: 'The newest members, selected in the 2026–27 recruitment, each working in one of the seven domains.',
  },
]

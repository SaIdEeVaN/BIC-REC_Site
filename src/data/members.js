// Faculty coordinators and student board for the club's next tenure, in the groups and order the club published.
// The list only gives names and roles: add `department`, `year`, `bio` or `linkedin` to a member when the club
// has them — the member cells show whatever is present.
export const facultyCoordinators = [
  { name: 'Dr. Muneeshwari R', email: 'muneeshwari.p@rajalakshmi.edu.in' },
  { name: 'Dr. Manoranjini J', email: 'manoranjini.j@rajalakshmi.edu.in' },
]

// One seat can hold several people (e.g. two Ambassadors): each person gets their own card.
const seat = (role, ...names) => names.map((name) => ({ name, role }))

export const boardGroups = [
  {
    title: 'Core board',
    members: [
      ...seat('President', 'Rakshitha R'),
      ...seat('Vice President', 'Muhammad Fahad SJ'),
      ...seat('Ambassador', 'Prithika S', 'Akash D'),
    ],
  },
  {
    title: 'Executive team',
    members: [
      ...seat('Operations Executive', 'Sangita V'),
      ...seat('Technology Executive', 'Baviri Setty Sai Deevan'),
      ...seat('Secretary', 'R. Lakshana'),
      ...seat('Treasurer', 'V. Sanjaivel'),
    ],
  },
  {
    title: 'Empowerment committee',
    members: [...seat('Head', 'Pavithra J'), ...seat('Co-Head', 'Satya')],
  },
  {
    title: 'Design',
    members: [
      ...seat('Head of Design', 'Kishoreathava S'),
      ...seat('Head of Design (Co-Head)', 'Pratiba'),
      ...seat('Design Co-Lead', 'Janane Jaipratha S'),
    ],
  },
  {
    title: 'Events',
    members: seat('Head of Events', 'Padma Priya J'),
  },
  {
    title: 'PR',
    members: [...seat('Head of PR', 'Karthick Raja R'), ...seat('PR Co-Lead', 'Sabari Girivasan S')],
  },
  {
    title: 'Tech',
    members: [
      ...seat('Tech Lead', 'Arjun K'),
      ...seat('Tech Co-Lead', 'Sanjayram M'),
      ...seat('Frontend Lead', 'Siddesh Kumar L'),
      ...seat('Blockchain Lead', 'Kabilan S'),
    ],
  },
  {
    title: 'Research',
    members: seat('Research Lead', 'Muhilan S', 'M. Harish Karthikeyan'),
  },
  {
    title: 'Media',
    members: [
      ...seat('Media Lead', 'Yogadharshini NK', 'Keerthana G'),
      ...seat('Media Co-Lead', 'Janis Olivia A', 'Harshini'),
    ],
  },
]


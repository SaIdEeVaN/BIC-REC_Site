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

export const coreMembers = [
  { id: 1, name: 'Sanjay Mohan', role: 'Smart Contract Developer', team: 'Technical Team', department: 'CSE', year: '3rd Year', photo: null, linkedin: '#' },
  { id: 2, name: 'Deepa Ramachandran', role: 'Web3 Developer', team: 'Technical Team', department: 'CSE', year: '2nd Year', photo: null, linkedin: '#' },
  { id: 3, name: 'Mohammed Ali K', role: 'Blockchain Researcher', team: 'Technical Team', department: 'IT', year: '3rd Year', photo: null, linkedin: '#' },
  { id: 4, name: 'Lakshmi Priya S', role: 'DApp Developer', team: 'Technical Team', department: 'CSE', year: '2nd Year', photo: null, linkedin: '#' },
  { id: 5, name: 'Ravi Shankar P', role: 'Events Coordinator', team: 'Events Team', department: 'ECE', year: '3rd Year', photo: null, linkedin: '#' },
  { id: 6, name: 'Kavitha Sundar', role: 'Event Logistics', team: 'Events Team', department: 'IT', year: '2nd Year', photo: null, linkedin: '#' },
  { id: 7, name: 'Aditya Kumar V', role: 'Sponsorship & Budget', team: 'Events Team', department: 'CSE', year: '3rd Year', photo: null, linkedin: '#' },
  { id: 8, name: 'Pooja Nair', role: 'Graphic Designer', team: 'Design & Media Team', department: 'IT', year: '2nd Year', photo: null, linkedin: '#' },
  { id: 9, name: 'Rahul Menon', role: 'Content Creator & Photographer', team: 'Design & Media Team', department: 'CSE', year: '2nd Year', photo: null, linkedin: '#' },
  { id: 10, name: 'Anjali Suresh', role: 'Social Media Manager', team: 'PR & Outreach Team', department: 'ECE', year: '3rd Year', photo: null, linkedin: '#' },
  { id: 11, name: 'Nithish Kumar R', role: 'Community Manager', team: 'PR & Outreach Team', department: 'CSE', year: '2nd Year', photo: null, linkedin: '#' },
  { id: 12, name: 'Sreeja R', role: 'Technical Writer', team: 'Content Team', department: 'IT', year: '3rd Year', photo: null, linkedin: '#' },
  { id: 13, name: 'Gowtham Prakash', role: 'Blog & Newsletter', team: 'Content Team', department: 'CSE', year: '2nd Year', photo: null, linkedin: '#' },
  { id: 14, name: 'Harini Krishnan', role: 'Operations Coordinator', team: 'Operations Team', department: 'ECE', year: '3rd Year', photo: null, linkedin: '#' },
  { id: 15, name: 'Vijay Anand S', role: 'Resource Management', team: 'Operations Team', department: 'CSE', year: '2nd Year', photo: null, linkedin: '#' },
]

export const teams = ['Technical Team', 'Events Team', 'Design & Media Team', 'PR & Outreach Team', 'Content Team', 'Operations Team']

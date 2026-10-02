// Faculty coordinators and the student leadership (the board and the core team), in the groups and order the
// club publishes them. The associates (the newest members) are in data/associates.js.
//
// Contact details come from the club's own intake form. Members who predate it carry a name and role
// only — the cells and the detail page render whatever is present, so a partial record is fine.
//
// `email` is shown on a member's own page at the club's request, alongside their LinkedIn and Instagram.
// It is deliberately left off the grids at /team/board and /team/core: a page listing every address at once is a
// far easier scrape than one page per person holding one each. Keep it that way when adding to MemberCell.
//
// `slug` is two things at once for the student leadership: the member's address (/team/board/<slug> or
// /team/core/<slug>, see memberPath), and the name their photo file must carry. Drop src/assets/members/<slug>.jpg (or .jpeg/.png/.webp) in and it
// appears — see lib/memberPhotos.js. Until then the cell falls back to their initials.
//
// The faculty coordinators carry a slug for the photo alone. They have no page of their own: routes, the
// sitemap and the e2e suite all walk `teamMembers`, which is the student leadership only.
export const facultyCoordinators = [
  {
    name: 'Dr. Muneeshwari R',
    slug: 'muneeshwari-r',
    email: 'muneeshwari.p@rajalakshmi.edu.in',
    linkedin: 'https://www.linkedin.com/in/dr-muneeshwari-p-84aba561/',
  },
]

// "faculty coordinator" or "faculty coordinators", for text that names them as a group.
export const FACULTY = facultyCoordinators.length === 1 ? 'faculty coordinator' : 'faculty coordinators'

// Every group of the club's leadership, in page order. `team` says which page it belongs to:
// - 'board': the core board and the executive team, at /team/board.
// - 'core': the leads and co-leads of each domain (the core team), at /team/core, in the club's domain order.
const groups = [
  {
    team: 'board',
    title: "Core board",
    members: [
      {
        name: "Rakshitha R",
        slug: "rakshitha-r",
        role: "President",
        department: "CSE",
        email: "rakshitha.r.2024.cse@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/rakshitha-r-928660322",
        instagram: "https://www.instagram.com/_.rakshi._28",
      },
      {
        name: "Muhammed Fahad SJ",
        slug: "muhammed-fahad-sj",
        role: "Vice President",
        department: "Mechatronics",
        email: "muhammadfahad.sj.2024.mct@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/muhammad-fahad-07910b332",
        instagram: "https://www.instagram.com/mdfahad._",
      },
      {
        name: "Pavithra J",
        slug: "pavithra-j",
        role: "Secretary",
        department: "CSE",
        email: "pavithra.j.2024.cse@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/pavithra-j-134279331",
        instagram: "https://www.instagram.com/_vivi_pavi_006",
      },
      {
        name: "Prithika S",
        slug: "prithika-s",
        role: "Ambassador",
        department: "CSE",
        email: "prithika.s.2024.cse@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/prithika-s-473442377",
        instagram: "https://www.instagram.com/_.prithika_07",
      },
      {
        name: "Akash D",
        slug: "akash-d",
        role: "Ambassador",
        department: "CSBS",
        email: "akash.d.2025.csbs@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/akash-d-ak1402008",
        instagram: "https://www.instagram.com/_akash_ak__03",
      },
    ],
  },
  {
    team: 'board',
    title: "Executive team",
    members: [
      {
        name: "Sangita V",
        slug: "sangita-v",
        role: "Operations Executive",
        department: "IT",
        email: "sangita.v.2024.it@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/sangita-v-b3681632a",
        instagram: null,
      },
      {
        name: "Baviri Setty Sai Deevan",
        slug: "baviri-setty-sai-deevan",
        role: "Technology Executive",
        department: "CSE (Cyber Security)",
        email: "bavirisettysaideevan.2024.csecs@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/bavirisetty-sai-deevan",
        instagram: "https://www.instagram.com/_._saideevan_._",
      },
      {
        name: "V Sanjaivel",
        slug: "v-sanjaivel",
        role: "Treasurer",
        department: "CSE",
        email: "sanjaivel.v.2025.cse@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/sanjaivel-v-82a68b38a",
        instagram: "https://www.instagram.com/sanjaivel._07",
      },
    ],
  },
  {
    team: 'core',
    title: "Event",
    members: [
      {
        name: "Satyaa S",
        slug: "satyaa-s",
        role: "Event Co-Lead",
        department: "CSE",
        email: "satyaa.s.2025.cse@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/satyaa-s-4b343a317",
        instagram: "https://www.instagram.com/satyaaxd",
      },
    ],
  },
  {
    team: 'core',
    title: "PR and Outreach",
    members: [
      {
        name: "Karthick Raja R",
        slug: "karthick-raja-r",
        role: "PR and Outreach Lead",
        department: "ECE",
        email: "karthickraja.r.2024.ece@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/karthick-raja-033359381",
        instagram: "https://www.instagram.com/karthick_.raja07",
      },
      {
        name: "Sabari Girivasan S",
        slug: "sabari-girivasan-s",
        role: "PR and Outreach Co-Lead",
        department: "CSE",
        email: "sabarigirivasan.s.2025.cse@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/sabari-girivasan-s-9b8989291",
        instagram: "https://www.instagram.com/sgv_2008",
      },
    ],
  },
  {
    team: 'core',
    title: "Technical",
    members: [
      {
        name: "Arjun K",
        slug: "arjun-k",
        role: "Technical Lead",
        department: "AIML",
        email: "arjun.k.2024.aiml@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/arjun-k08062006",
        instagram: "https://www.instagram.com/arjunkothandann",
      },
      {
        name: "Sanjayram M",
        slug: "sanjayram-m",
        role: "Technical Co-Lead",
        department: "CSE",
        email: "sanjayram.m.2024.cse@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/sanjayram-m-025969331",
        instagram: "https://www.instagram.com/sanjayram_3142",
      },
      {
        name: "Siddesh Kumar L",
        slug: "siddesh-kumar-l",
        role: "Frontend Lead",
        department: null,
        email: null,
        linkedin: null,
        instagram: null,
      },
    ],
  },
  {
    team: 'core',
    title: "Design",
    members: [
      {
        name: "Kishoreathava S",
        slug: "kishoreathava-s",
        role: "Head of Design",
        department: null,
        email: null,
        linkedin: null,
        instagram: null,
      },
      {
        name: "S. Pratiba",
        slug: "s-pratiba",
        role: "Co-Head of Design",
        department: "CSE (Cyber Security)",
        email: "pratiba.s.2024.csecs@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/pratiba-s-73042b32b",
        instagram: "https://www.instagram.com/pratiba.06",
      },
      {
        name: "Janane Jaipratha S",
        slug: "janane-jaipratha-s",
        role: "Design Co-Lead",
        department: "AIML",
        email: "jananejaipratha.s.2024.aiml@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/jananejaipratha-s-b27302318",
        instagram: "https://www.instagram.com/janane_10_",
      },
    ],
  },
  {
    team: 'core',
    title: "Research and Innovation",
    members: [
      {
        name: "Muhilan S",
        slug: "muhilan-s",
        role: "Research and Innovation Lead",
        department: "CSD",
        email: "muhilan.s.2024.csd@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/muhilan-s-6a2120332",
        instagram: "https://www.instagram.com/classy_muhi",
      },
      {
        name: "M. Harish Karthikeyan",
        slug: "m-harish-karthikeyan",
        role: "Research and Innovation Lead",
        department: "ECE",
        email: "harishkarthikeyan.m.2024.ece@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/harishkarthikeyan-m-26587332a",
        instagram: "https://www.instagram.com/h_k_3050",
      },
    ],
  },
  {
    team: 'core',
    title: "Media",
    members: [
      {
        name: "Mohammed Irfan S",
        slug: "mohammed-irfan-s",
        role: "Media Director",
        department: "AI & DS",
        email: "mohammedirfan.s.2024.aids@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/mohammed-irfan-s-9b7203322",
        instagram: "https://www.instagram.com/irfan._xd_",
      },
      {
        name: "Yogadharshini NK",
        slug: "yogadharshini-nk",
        role: "Visual Media Lead",
        department: null,
        email: null,
        linkedin: null,
        instagram: null,
      },
      {
        name: "Keerthana G",
        slug: "keerthana-g",
        role: "Digital Media Lead",
        department: "CSE",
        email: "keerthana.g.2024.cse@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/keerthana-g-8a9b16333",
        instagram: "https://www.instagram.com/keerth.1513",
      },
      {
        name: "Janis Olivia A",
        slug: "janis-olivia-a",
        role: "Digital Media Co-Lead",
        department: "CSE",
        email: "janisolivia.a.2025.cse@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/janis-olivia-418220384",
        instagram: "https://www.instagram.com/janisolivia_a",
      },
      {
        name: "Harshini",
        slug: "harshini",
        role: "Visual Media Co-Lead",
        department: null,
        email: null,
        linkedin: null,
        instagram: null,
      },
    ],
  },
]

// Each member carries their team and group, so a cell or a page can link to them (memberPath) on its own.
const withTeam = (group) => ({
  ...group,
  members: group.members.map((member) => ({ ...member, team: group.team, group: group.title })),
})

export const boardGroups = groups.filter((group) => group.team === 'board').map(withTeam)
export const coreGroups = groups.filter((group) => group.team === 'core').map(withTeam)

// Flat rosters in page order: what the detail page uses to find a member and to step to the next one.
const flatten = (list) => list.flatMap((group) => group.members)

export const boardMembers = flatten(boardGroups)
export const coreTeamMembers = flatten(coreGroups)
// Everyone with a page of their own, board first.
export const teamMembers = [...boardMembers, ...coreTeamMembers]

// A member's page lives under their team: /team/board/<slug> or /team/core/<slug>.
export const memberPath = (member) => `/team/${member.team}/${member.slug}`

export const getMemberBySlug = (slug) => teamMembers.find((member) => member.slug === slug)

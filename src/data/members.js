// Faculty coordinators and the student board, in the groups and order the club publishes them.
//
// Contact details come from the club's own intake form. Members who predate it carry a name and role
// only — the cells and the detail page render whatever is present, so a partial record is fine.
//
// `email` is shown on a member's own page at the club's request, alongside their LinkedIn and Instagram.
// It is deliberately left off the grid at /team/board: a page listing twenty-five addresses at once is a
// far easier scrape than twenty-five pages holding one each. Keep it that way when adding to MemberCell.
//
// `slug` is two things at once for the student board: the member's address at /team/board/<slug>, and the
// name their photo file must carry. Drop src/assets/members/<slug>.jpg (or .jpeg/.png/.webp) in and it
// appears — see lib/memberPhotos.js. Until then the cell falls back to their initials.
//
// The faculty coordinators carry a slug for the photo alone. They have no page of their own: routes, the
// sitemap and the e2e suite all walk `boardMembers`, which is the student board only.
export const facultyCoordinators = [
  {
    name: 'Dr. Muneeshwari R',
    slug: 'muneeshwari-r',
    email: 'muneeshwari.p@rajalakshmi.edu.in',
    linkedin: 'https://www.linkedin.com/in/dr-muneeshwari-p-84aba561/',
  },
  {
    name: 'Dr. Manoranjini J',
    slug: 'manoranjini-j',
    email: 'manoranjini.j@rajalakshmi.edu.in',
    linkedin: 'https://www.linkedin.com/in/dr-manoranjini-j-14b0482b4/',
  },
]

export const boardGroups = [
  {
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
        name: "Pavithra J",
        slug: "pavithra-j",
        role: "Secretary",
        department: "CSE",
        email: "pavithra.j.2024.cse@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/pavithra-j-134279331",
        instagram: "https://www.instagram.com/_vivi_pavi_006",
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
    title: "Events",
    members: [
      {
        name: "Padma Priya J",
        slug: "padma-priya-j",
        role: "Head of Events",
        department: null,
        email: null,
        linkedin: null,
        instagram: null,
      },
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
    title: "PR",
    members: [
      {
        name: "Karthick Raja R",
        slug: "karthick-raja-r",
        role: "PR Lead",
        department: "ECE",
        email: "karthickraja.r.2024.ece@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/karthick-raja-033359381",
        instagram: "https://www.instagram.com/karthick_.raja07",
      },
      {
        name: "Sabari Girivasan S",
        slug: "sabari-girivasan-s",
        role: "PR Co-Lead",
        department: "CSE",
        email: "sabarigirivasan.s.2025.cse@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/sabari-girivasan-s-9b8989291",
        instagram: "https://www.instagram.com/sgv_2008",
      },
    ],
  },
  {
    title: "Tech",
    members: [
      {
        name: "Arjun K",
        slug: "arjun-k",
        role: "Tech Lead",
        department: "AIML",
        email: "arjun.k.2024.aiml@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/arjun-k08062006",
        instagram: "https://www.instagram.com/arjunkothandann",
      },
      {
        name: "Sanjayram M",
        slug: "sanjayram-m",
        role: "Tech Co-Lead",
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
      {
        name: "Kabilan S",
        slug: "kabilan-s",
        role: "Blockchain Lead",
        department: "AIML",
        email: "kabilan.s.2024.aiml@rajalakshmi.edu.in",
        linkedin: "https://www.linkedin.com/in/kabilan-senthilkumar-b35a91287",
        instagram: "https://www.instagram.com/_its_me_techkykabilan_",
      },
    ],
  },
  {
    title: "Research",
    members: [
      {
        name: "Muhilan S",
        slug: "muhilan-s",
        role: "Research Lead",
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
    title: "Media",
    members: [
      {
        name: "Yogadharshini NK",
        slug: "yogadharshini-nk",
        role: "Media Lead",
        department: null,
        email: null,
        linkedin: null,
        instagram: null,
      },
      {
        name: "Keerthana G",
        slug: "keerthana-g",
        role: "Media Lead",
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
        role: "Media Co-Lead",
        department: null,
        email: null,
        linkedin: null,
        instagram: null,
      },
    ],
  },]

// Flat roster in page order — what the detail page uses to find a member and to step to the next one.
export const boardMembers = boardGroups.flatMap((group) =>
  group.members.map((member) => ({ ...member, group: group.title }))
)

export const getMemberBySlug = (slug) => boardMembers.find((member) => member.slug === slug)

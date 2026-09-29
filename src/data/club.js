// The club's own contact details and profiles, in one place.
//
// The email used to be spelled out in five places across Contact and the Footer. One of them was
// corrected and the others weren't, so the site spent three weeks addressing everything to a domain
// that doesn't exist (`rajalakshmil.edu.in`, with a stray `l`) and every message bounced. The social
// links had the same shape — Instagram in six files, LinkedIn in three — so they live here too, and
// there is only ever one copy of each to change.
export const CLUB_EMAIL = 'kbaclub@rajalakshmi.edu.in'
export const CLUB_MAILTO = `mailto:${CLUB_EMAIL}`

// The bare profile URL. The copy this replaced carried Instagram's share-sheet tracking parameters
// (`utm_source` and an `igsi` share id), which tag every visit as coming from one person's share tap.
export const CLUB_INSTAGRAM = 'https://www.instagram.com/bic.rec/'
export const CLUB_LINKEDIN = 'https://www.linkedin.com/company/bicrec'

// Recruitment results live on their own site (the result_bic repo, deployed as a second Firebase site in
// this project). The Core Members page links there until the roster is published.
export const RECRUITMENT_RESULTS_URL = 'https://bicrec-results.web.app'

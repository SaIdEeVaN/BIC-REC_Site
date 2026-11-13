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

// How the contact form (/contact) delivers a message.
//
// Empty: the site sends nothing itself. The form opens the visitor's own email app with the message written and
// addressed to the club, and they press send there. That only works on a device with an email app set up, which
// leaves out a good many phones and most shared PCs.
//
// Set to the club's Web3Forms access key: the form sends the message itself, to the inbox the key was issued for,
// and offers the email app only if that fails. To get a key, enter CLUB_EMAIL at https://web3forms.com — the key
// is emailed to that inbox, so it has to be done by someone who can read it. The key is not a secret: all it can
// do is send to that one inbox, so it belongs here in the code, as the address itself does.
export const CONTACT_FORM_KEY = ''

// Recruitment results live on their own site (the result_bic repo, deployed as a second Firebase site in
// this project).
export const RECRUITMENT_RESULTS_URL = 'https://bicrec-results.web.app'

// The Associates page's switch (/team/associates). false: "Results coming soon". true: "Check your result",
// with a button to RECRUITMENT_RESULTS_URL. Flip it only once the real results are published there — until
// then the results site holds sample data and every candidate would get "no match".
export const RECRUITMENT_RESULTS_OPEN = true

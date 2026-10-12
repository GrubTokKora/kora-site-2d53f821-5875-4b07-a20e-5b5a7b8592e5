# Site index · format 2
Structure and the names of what each page offers. Values that change often — prices, hours, phone,
address — and body copy are deliberately not recorded here; read the page itself for those.

## index.html → /
title: JayaKrishna Arts | Original Paintings, Andhra Pradesh, India
purpose: Homepage for painter JayaKrishna Bandari — collections, gallery, living with art, landscapes and portrait commissions (US-focused).
sections:
- `#top` — hero slideshow, "Four decades at the easel."
- intro — studio statement
- `#collections` "The Collections" — four category cards (Abstracts, Watercolors, Portraits, Landscapes); each opens the gallery filtered
- `#gallery` "Works from the studio" — filterable masonry of all 37 works with a lightbox
- `#living` "Living with art" — horizontal rail of works shown in room and gallery settings
- `#landscapes` — full-width panorama and two landscapes in room settings
- `#portraits` "From your photograph to a finished portrait." — four reference/painting pairs
- `#commissions` "A portrait, painted for you." — commission steps

## india.html → /india
title: JayaKrishna in India: Cinema & Honours | JayaKrishna Arts
purpose: The artist's work and recognition in India, moved off the homepage; linked from the footer ("Work in India").
sections:
- intro — "Painted in India, honoured on stage."
- `#cinema` "Painted into Indian cinema" — six film credits and exhibitions
- `#honours` "Recognised by the masters" — Balamuralikrishna, S. P. Balasubrahmanyam, Open Studio Hartford
- quotes — rotating distinctions
- `#india-works` "Subjects from India" — seven works from the collection, lightbox

## 404.html → /404
title: Page not found | JayaKrishna Arts
purpose: Platform not-found page (noindex) linking back to the homepage.

## support files
Files that are not pages. A line marked [content] holds words or data a visitor reads, so a
change to the site's content can land there; the rest only make the site work or look right.
- `assets/site.js` — mobile menu, hero slideshow, scroll reveal, quote rotator, gallery filters, rail buttons
- `assets/lightbox.js` — plain-JavaScript lightbox (no library): zoom, pan, swipe, keyboard, captions
- `src/input.css` — @theme tokens and the component stylesheet (compiled to assets/styles.css at deploy)
- `assets/img/` — paintings and photos (WebP); `assets/img/<category>/` full-size works from issue #432, `thumbs/` 1200px versions for the grids; `assets/logo/` — wordmark and favicon (PNG)
- `llms.txt` [content] — business summary for AI crawlers
- `robots.txt`, `sitemap.xml`, `_redirects`, `site.webmanifest`

## shared (every page)
The header, navigation, mobile menu and footer are propagated from index.html to every other page by
`shell_propagation`. A change to any of them is made on index.html alone and copied automatically.

# Site index · format 2
Structure and the names of what each page offers. Values that change often — prices, hours, phone,
address — and body copy are deliberately not recorded here; read the page itself for those.

## index.html → /
title: JayaKrishna Arts | Original Paintings, Andhra Pradesh, India
purpose: Homepage for painter JayaKrishna Bandari — collections, featured works, the artist, cinema, honours and portrait commissions.
sections:
- `#top` — hero slideshow, "Four decades at the easel."
- intro — studio statement
- `#collections` "The Collections" — oil paintings, watercolours, abstracts
- `#featured` "Featured Works" — eight originals with WhatsApp enquiry links
- `#artist` "JayaKrishna Bandari" — bio and stats
- `#cinema` "Painted into Indian cinema" — film credits and exhibitions
- `#honours` "Recognised by the masters" — three honours
- quotes — rotating distinctions
- `#commissions` "A portrait, painted for you." — commission steps

## 404.html → /404
title: Page not found | JayaKrishna Arts
purpose: Platform not-found page (noindex) linking back to the homepage.

## support files
Files that are not pages. A line marked [content] holds words or data a visitor reads, so a
change to the site's content can land there; the rest only make the site work or look right.
- `assets/site.js` — mobile menu, hero slideshow, scroll reveal, quote rotator
- `src/input.css` — @theme tokens and the component stylesheet (compiled to assets/styles.css at deploy)
- `assets/img/` — paintings and photos (WebP); `assets/logo/` — wordmark and favicon (PNG)
- `llms.txt` [content] — business summary for AI crawlers
- `robots.txt`, `sitemap.xml`, `_redirects`, `site.webmanifest`

## shared (every page)
The header, navigation, mobile menu and footer are propagated from index.html to every other page by
`shell_propagation`. A change to any of them is made on index.html alone and copied automatically.

<!-- Design decision for JayaKrishna Arts. Source: Claude Design "Home A - Ivory Museum",
     rebuilt as static HTML for Kora (homepage + 404). Business: JayaKrishna Arts -->

# DESIGN.md — JayaKrishna Arts

archetype: museum-heritage
rationale: A painter with four decades of work, honours and film credits needs the site to behave like a quiet private museum — limewash walls, arched niches and framed originals — so the paintings carry the page and the type stays out of their way.
interaction_level: L2

personality: [refined, warm, authoritative, unhurried]

typography:
  display: "Cormorant Garamond"
  body: "Manrope"
  notes: |
    - Display: Cormorant Garamond 400 (500 for the wordmark), italics for emphasis words. Hero h1 clamp(52px, 7.2vw, 104px), line-height .95; section h2 clamp(40px, 4.4vw, 64px).
    - Body: Manrope 400 at 14–16px, line-height 1.6–1.8.
    - Labels: Manrope 11–12px, uppercase, letter-spacing .16–.32em.
    - Logo (PNG, assets/logo/): signature mark — italic "JayaKrishna" (Cormorant 500) over a terracotta dry-brush sweep, "ARTS" in spaced caps.
      Header uses the one-line lockup logo-horizontal.png; footer logo-reversed.png (ivory + soft clay); favicon is italic "JK" over a brush dab.
      The logo carries the name only — no location line.

palette:
  primary: "#a8492b"
  secondary: "#f4eee4"
  accent: "#1e2233"
  ground: "#f4eee4"
  surface: "#eae1d2"
  ink: "#1e2233"
  muted: "#6b6457"
  border: "#d4ccbe"
  application: |
    - Ground: limewash ivory; Surface: sand bands (featured works, quotes).
    - Ink navy carries text and the dark bands (cinema/exhibitions, footer).
    - Terracotta is the single accent: labels, numerals, the commissions band, the artist quote tag.
    - Soft clay #e2a27f and stone #bdb6a8 are the accent and muted tones on navy.

composition:
  whitespace: generous
  photography: the artist's own paintings and exhibition/honour photos, all local WebP in assets/img
  card_usage: arched (temple-niche) frames for collections and the artist; white-mat frames for works
  mobile: |
    - Below 1000px the split navigation collapses to the wordmark + a MENU button that opens a serif link list.
    - All grids are auto-fit and fall to one column; nothing scrolls horizontally at 390px.

sections:
  - id: top (hero) — full-bleed crossfading slideshow (4 slides, 6.5s, slow zoom) with dark gradient, h1 "Four decades at the easel.", caption + slide bars.
  - intro — centred serif statement with ruled label "The Studio of JayaKrishna Bandari".
  - id: collections — four rectangular category cards (Abstracts 18, Watercolors 12, Portraits 4, Landscapes 3) that filter the gallery.
  - id: gallery — "Works from the studio": filterable masonry of all 37 works in natural orientation, plain-JS lightbox with caption + enquiry link.
  - id: living — "Living with art": horizontal snap rail of the room / gallery mockups, lightbox.
  - id: landscapes — full-bleed panorama (uncropped 2:1) + two in-room landscapes on ink.
  - id: artist — arched photo with terracotta tag, name, bio, 40+ / 6,000+ / 1,500+ stats.
  - id: portraits — "From your photograph to a finished portrait": the four reference/painting pairs, 2x2 on sand, lightbox.
  - id: commissions — terracotta split: three steps + "Begin a commission" (WhatsApp).
  - footer (id: contact column) — phone +91 90005 00669, WhatsApp, krishnaartstudio@gmail.com.

pages:
  - index.html — US-focused homepage (no India-specific sections; header nav: Collections, Gallery, Commissions, Contact).
  - india.html — "Work in India": intro, Indian cinema + exhibitions, honours, quotes band, Subjects from India gallery (same images + lightbox). Linked from the footer Studio column.

avoid:
  - Invented prices, testimonials, quotes in the artist's voice, certificates, or a cart.
  - Locations other than Andhra Pradesh, India.
  - Links to the old jayakrishnaarts.com pages.
  - Inline layout styles (grids/widths) — layout lives in src/input.css.
  - Cropping artworks: gallery tiles and frames show each work whole, in its own orientation.
  - SVG or raster formats other than PNG for logos and WebP for site images.

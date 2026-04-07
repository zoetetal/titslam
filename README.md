# TITSLAM

**Theologically Integrated Theory of Scolopendra Levels Analogues and Metaphors**

A fan theory site about the Scolopendra levels in the [Dungeon Crawler Carl](https://www.mattdinniman.com/) book series by Matt Dinniman.

**Live site:** [zoetetal.github.io/titslam](https://zoetetal.github.io/titslam/)

## What is this?

A single-page Hugo site presenting a theory that the Scolopendra levels in Dungeon Crawler Carl represent the political and economic history of the galaxy, with people, places, and things serving as direct analogues to elements outside the dungeon.

## Features

- **Per-book spoiler system** — Content is tagged by book (levels 0–10). Readers toggle spoiler visibility based on how far they've read. Levels 0–2 are revealed by default.
- **Color-coded spoiler bars** — Each book/level has a distinct color from the "covers" palette, extracted from book cover art.
- **Dark/Light theme toggle** — Sans-serif themes with a simple toggle button.
- **Table of contents sidebar** — Sticky TOC with scrollspy highlighting on desktop, collapsible on mobile.
- **Mobile-friendly** — Responsive layout with touch-aware tooltip auto-dismiss.
- **Quote shortcode** — Styled blockquotes with book attribution and spoiler wrapping.
- **Book title shortcode** — Inline expansion of book acronyms (e.g., DCC, CDS) with tooltips.

## Tech stack

- [Hugo](https://gohugo.io/) (static site generator)
- GitHub Pages via GitHub Actions
- Vanilla CSS + JS (no frameworks)
- Hugo Pipes for CSS/JS minification

## Local development

```sh
# Install Hugo (macOS)
brew install hugo

# Run dev server
cd titslam
hugo server --noHTTPCache --baseURL http://localhost:1313/
```

## Project structure

```
content/_index.md        # All theory content with spoiler shortcodes
layouts/
  _default/baseof.html   # Base HTML template, theme toggle, palette CSS
  index.html             # Home page layout with spoiler controls + TOC
  shortcodes/
    spoiler.html          # Inline spoiler shortcode
    quote.html            # Book quote shortcode
    book.html             # Book title/acronym shortcode
assets/
  css/main.css            # Themes, layout, TOC, responsive styles
  css/spoilers.css        # Spoiler bar, control panel, hover states
  js/spoilers.js          # Toggle logic, localStorage, tooltips
  js/toc.js               # Scrollspy + mobile TOC toggle
data/
  books.yaml              # Book metadata (numbers, titles, acronyms)
  palettes.yaml           # Color palettes for spoiler levels
```

## Shortcode usage

```markdown
<!-- Paragraph spoiler (single line required) -->
{{% spoiler level="2" %}}Spoiler text here.{{% /spoiler %}}

<!-- Inline chained spoilers (no paragraph wrapping) -->
{{< spoiler level="2" >}}First part,{{< /spoiler >}}{{< spoiler level="5" >}} second part.{{< /spoiler >}}

<!-- Book quote with spoiler -->
{{< quote book="2" chapter="Chapter 3" >}}Quote text here.{{< /quote >}}

<!-- Book title reference -->
{{< book 1 >}}        <!-- Full title -->
{{< book 1 "short" >}} <!-- Acronym -->
```

## License

Content is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

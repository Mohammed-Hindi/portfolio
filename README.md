# Mohammed El-Hindi — Full-Stack Developer Portfolio

A responsive, interactive 3D portfolio for **Mohammed El-Hindi (محمد الهندي)**, a Gaza-based Full-Stack Developer focused on Laravel, Vue.js, REST APIs, and practical web applications.

The experience combines a Three.js space scene with accessible HTML sections for an introduction, background, technical skills, selected projects, and contact links.

If a browser blocks WebGL, the portfolio switches to a normal scrollable layout so its content and project interactions remain available. Browsers with WebGL continue to use the full 3D experience.

## Live site

The intended GitHub Pages address is:

**https://mohammed-hindi.github.io/portfolio/**

Enable GitHub Pages in the repository settings after uploading the project (Settings → Pages → deploy from the `main` branch, `/` folder, or the branch used for deployment).

## Sections

- **Home:** introduction and developer focus.
- **About:** background, education, and experience.
- **Skills:** frontend, backend, and development tools.
- **Projects:** featured case studies, architecture, technologies, and repository/demo links.
- **Contact:** GitHub, Instagram, and Gmail compose link.

## Built with

- Three.js for the interactive 3D environment.
- Vanilla JavaScript modules for navigation, project data, and interactions.
- HTML5 and CSS3 for responsive and accessible content.
- Space Grotesk and Inter typography.

## Run locally

This project has no build step. Serve the root directory over HTTP so that ES modules and the import map work correctly.

```bash
python -m http.server 8000
```

Open <http://localhost:8000> in a browser with WebGL support.

## Search engine setup

The repository includes:

- Search-friendly page title, description, social sharing metadata, and a canonical URL.
- Person and website structured data that connect the portfolio with Mohammed's Arabic and English name and public profiles.
- `robots.txt` and a root-level `sitemap.xml` for the portfolio URL.
- `og-image.png` for link previews and `favicon.svg` for the browser tab and navigation logo.

After deploying:

1. Add and verify the site in [Google Search Console](https://search.google.com/search-console/).
2. Submit `https://mohammed-hindi.github.io/portfolio/sitemap.xml` in the Sitemaps report.
3. Use URL Inspection to request indexing for `https://mohammed-hindi.github.io/portfolio/`.
4. Update the canonical URL, sitemap, robots sitemap entry, and social image URLs if the project is deployed at a different address.

Sitemap submission and SEO metadata help search engines understand and discover the site; they do not guarantee a specific ranking. Search visibility depends on Google's indexing and ranking systems, the quality and usefulness of the published content, and relevant references to the site.

## Contact

- GitHub: <https://github.com/Mohammed-Hindi>
- Instagram: <https://www.instagram.com/mohammed.h.hindi/>
- Email: <moh5408415@gmail.com>

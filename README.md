<div align="center">

# Lupa Painting — Website

**Residential & Commercial Painting · Massachusetts**

Source code for the updated Lupa Painting website, including service pages, project galleries and customer inquiry flows.

[**Official Website**](https://lupaservices.com/) · [**Repository**](https://github.com/danmarques127-sys/lupa-services)

</div>

<p align="center">
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white">
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css&logoColor=white">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black">
  <img alt="PHP" src="https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=php&logoColor=white">
  <img alt="Responsive" src="https://img.shields.io/badge/Responsive-Design-087E8B?style=flat-square">
  <img alt="SEO" src="https://img.shields.io/badge/SEO-Site%20Metadata-238636?style=flat-square">
  <img alt="Hosting" src="https://img.shields.io/badge/Apache%20%2F%20cPanel-Hosting-D22128?style=flat-square&logo=apache&logoColor=white">
</p>

---

## Overview

Lupa Painting's website features painting and related services, project showcases, company information, reviews, contact forms and a blog. The intended replacement version was supplied in two source archives: `vscode.zip` (pages) and `css_folder_services.zip` (CSS, JS and favicon assets).

**Repository synchronization status:** The uploaded source archives differ from the legacy website currently tracked in this repository. The new version must be deployed and checked alongside its full media library; updating this README alone does not update the live website.

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | HTML5, CSS3, vanilla JavaScript |
| Dynamic pages | PHP blog |
| Styling | Shared, page-specific and service-specific CSS |
| Assets | Images, videos, SVG and favicon resources |
| SEO | Sitemap, robots.txt, structured page metadata |
| Hosting | Apache / cPanel-compatible hosting |

## Intended Project Structure

```text
index.html
about.html
services.html
reviews.html
contact.html
inspiration.html
privacy.html
terms.html
blog.php
404.html
services/
  interior-painting/
  exterior-painting/
  deck-fence-painting/
  cabinet/
  carpentry/
  trim-door/
  drywall-repair/
  power-washing/
  commercial/
assets/
  css_main/
  css_pages/
  css_folder_services/
  js/
  favicons/
  images/      # large media provided separately
  videos/      # large media provided separately
```

## Deployment

1. Back up the live website and its entire media library before replacing existing files.
2. Deploy the updated pages, CSS, JavaScript and favicons, preserving the directory structure.
3. Restore all required photos and videos under the exact paths referenced in the pages.
4. Configure PHP on the production host for `blog.php` and other dynamic functionality.
5. Check HTTPS, rewrites, canonical URLs and the correct official production domain.
6. Test navigation, all nine service categories, galleries, forms, blog and mobile layout.
7. Verify sitemap and robots.txt, image/video loading, browser console and server logs.

**Important:** some page metadata in the supplied source uses `lupaservices.com`, while the blog references `lupapaintingservices.com`. Choose and consistently apply the approved canonical domain before publishing. The HTML source includes a Formspree form endpoint; verify its owner, recipients and form delivery.

## Security

Do not commit private credentials, production API tokens, hosting passwords or client-private files. Review the PHP application, upload handling and server-side access controls before deployment. Never rely on `.gitignore` to erase secrets from old Git commits.

## SEO & Maintenance

Keep page titles, canonical URLs, service descriptions, sitemaps, structured data and Open Graph metadata consistent with the verified production domain. Maintain redirects from legacy URLs when replacing the previous website. Test mobile layouts and optimize heavy media files without breaking referenced paths.

## Maintainer & Ownership

Maintained under [danmarques127-sys](https://github.com/danmarques127-sys). Company branding, photography and video content remain subject to their respective usage rights.

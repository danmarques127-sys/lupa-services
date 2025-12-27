<!--
  Lupa Services — Architecture Documentation
  Theme: Dark Blue + Dark Yellow + Off White
  Author: DaNgelo Marques (GitHub: danmarques127-sys)
-->

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:F8F9FA,35:0B3C5D,70:FFC400,100:F8F9FA&height=220&section=header&text=Architecture&fontSize=48&fontColor=111827&animation=fadeIn&fontAlignY=38&desc=Routing%20%E2%80%A2%20Structure%20%E2%80%A2%20SEO%20%E2%80%A2%20Performance&descAlignY=64&descSize=18" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&pause=900&color=FFC400&center=true&vCenter=true&width=900&lines=Static+multi-page+architecture;SEO-first+decisions;Zero+build+step;Apache%2FcPanel+production+ready" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-Static%20MPA-0B3C5D?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Hosting-Apache%20%2F%20cPanel-111827?style=for-the-badge&logo=apache&logoColor=white" />
  <img src="https://img.shields.io/badge/Focus-SEO%20%26%20Performance-FFC400?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=0:F8F9FA,50:0B3C5D,100:F8F9FA&height=2&section=header" />
</p>

---

## 🎯 Architectural Overview

**Lupa Services & Lupa Painting** is built as a **static multi-page application (MPA)**, intentionally designed for:

- predictable behavior on shared hosting
- excellent SEO crawlability
- high performance with minimal complexity
- zero build step and zero framework dependency

This architecture prioritizes **clarity, portability, and reliability** over abstraction.

---

## 🧭 Pages & Routing

Each major business area is represented by a dedicated HTML page.

**Primary routes**
- `/index.html` — main landing page (brand + service overview)
- `/cleaning.html` — Cleaning services (Lupa Services)
- `/painting.html` — Painting services (Lupa Painting)

**Routing model**
- Pure static navigation using relative links
- No client-side router
- No server-side routing dependency

**Why**
- Works out-of-the-box on Apache/cPanel
- Clear URLs for users and search engines
- No JavaScript required for navigation

---

## 🧩 Header & Footer Strategy

### Current approach: static repetition (by design)

- Header and footer markup are repeated across pages.
- This is an intentional trade-off.

**Benefits**
- Zero runtime dependencies
- No build system required
- Maximum compatibility with low-cost hosting
- Easy debugging and predictable rendering

**Maintenance rule**
- Header/footer changes must be applied consistently across all HTML pages.
- Changes should be committed atomically to avoid drift.

> Future upgrade paths (optional):
> - Apache Server-Side Includes (SSI)
> - Static build step to inject partials  
> These are intentionally avoided at this stage to preserve simplicity.

---

## 🗃️ Content & “Blog” Data Model

The project follows a **static-first content philosophy**.

**Supported patterns**
- **HTML-first content**  
  Pages authored directly as semantic HTML.
- **Optional JS-driven lists**  
  If needed, structured content (e.g. blog cards) can be stored as:
  - JavaScript arrays/objects inside `assets/js/`

**Key rule**
- No CMS dependency
- No database
- All content is version-controlled

This ensures full portability and long-term maintainability.

---

## 🔍 SEO Architecture Decisions

SEO is treated as a **first-class concern**, not an afterthought.

**Core decisions**
- Semantic HTML (`header`, `main`, `section`, `footer`)
- One clear H1 per page
- Clean internal linking between services
- Mobile-first layout

**SEO assets**
- `seo/robots.txt`
- `seo/sitemap.xml`

**Why static**
- Faster crawl
- Lower failure surface
- Better Lighthouse scores

---

## ⚡ Performance Strategy

Performance is achieved through **constraint, not complexity**.

**Principles**
- Minimal JavaScript
- No heavy libraries
- CSS-driven layout and motion
- Optimized images

**Result**
- Fast first contentful paint
- Low Time To Interactive
- Consistent performance across devices

---

## 🗄️ Cache Policy (.htaccess)

Caching is enforced at the server level.

**Strategy**
- Long cache lifetime for:
  - CSS
  - JS
  - Images
  - Icons
- Shorter cache for HTML documents

**Why**
- Faster repeat visits
- Reduced bandwidth usage
- Safe content updates without stale pages

---

## 🗂️ Asset Organization

All public assets live under `/assets/`.

assets/
css/ # stylesheets
js/ # scripts
img/ # images (flattened)
icons/ # icons + favicons (flattened)

**Strict rules**
- No legacy `/images/` or `/icons/` paths in HTML
- No nested duplicates (e.g. `img/images/`)
- Consistent relative paths across pages

This prevents broken links and simplifies deployment.

---

## 🚀 Deployment Model

**Target environment**
- Apache + cPanel (production)

**Deployment steps**
1. Upload files to `public_html/`
2. Ensure `.htaccess` is present
3. Enable HTTPS / SSL
4. Validate links and assets on live domain

**Preview**
- GitHub Pages may be used for preview only
- Production always lives on the custom domain

---

## 🧠 Architectural Philosophy

This project intentionally avoids:
- frameworks
- build pipelines
- unnecessary abstractions

In favor of:
- clarity
- performance
- SEO reliability
- real-world hosting compatibility

This is **client-grade engineering**, not a demo.

---

**Maintainer:** Dangelo Marques  
**Repository:** https://github.com/danmarques127-sys/lupa-services

<p align="center"> <img src="https://capsule-render.vercel.app/api?type=waving&color=0:FFFFFF,60:FFC400,100:FFFFFF&height=120&section=footer" /> </p>

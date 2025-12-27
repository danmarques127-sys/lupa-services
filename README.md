<!--
  Lupa Services & Lupa Painting — README (Top-tier / Senior)
  Theme: Dark Blue + Yellow + White
  Author: DaNgelo Marques (GitHub: danmarques127-sys)
-->

<!-- HERO BACKDROP (inline SVG — no external images) -->
<p align="center">
  <svg width="980" height="260" viewBox="0 0 980 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lupa hero background">
    <defs>
      <!-- Soft background -->
      <linearGradient id="bg" x1="0" y1="0" x2="980" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FFFFFF"/>
        <stop offset="0.55" stop-color="#FFF7DD"/>
        <stop offset="1" stop-color="#FFFFFF"/>
      </linearGradient>

      <!-- Blue + Yellow ribbons -->
      <linearGradient id="ribbonBlue" x1="0" y1="0" x2="980" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#0B3C5D" stop-opacity="0.00"/>
        <stop offset="0.35" stop-color="#0B3C5D" stop-opacity="0.18"/>
        <stop offset="0.65" stop-color="#0B3C5D" stop-opacity="0.08"/>
        <stop offset="1" stop-color="#0B3C5D" stop-opacity="0.00"/>
      </linearGradient>

      <linearGradient id="ribbonYellow" x1="0" y1="0" x2="980" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FFC400" stop-opacity="0.00"/>
        <stop offset="0.45" stop-color="#FFC400" stop-opacity="0.22"/>
        <stop offset="0.70" stop-color="#FFC400" stop-opacity="0.10"/>
        <stop offset="1" stop-color="#FFC400" stop-opacity="0.00"/>
      </linearGradient>

      <filter id="blur" x="-10%" y="-60%" width="120%" height="220%">
        <feGaussianBlur stdDeviation="18"/>
      </filter>

      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#0B3C5D" flood-opacity="0.10"/>
      </filter>
    </defs>

    <!-- Background panel -->
    <rect x="0" y="0" width="980" height="260" rx="22" fill="url(#bg)" filter="url(#softShadow)"/>

    <!-- Soft ribbons (like Thalita’s) -->
    <path d="M0,120 C220,80 360,160 520,120 C690,80 780,70 980,115 L980,260 L0,260 Z"
          fill="url(#ribbonBlue)" filter="url(#blur)"/>
    <path d="M0,155 C260,210 390,115 560,160 C720,200 830,210 980,170 L980,260 L0,260 Z"
          fill="url(#ribbonYellow)" filter="url(#blur)"/>

    <!-- Tiny accent dots -->
    <circle cx="130" cy="70" r="5" fill="#FFC400" fill-opacity="0.35"/>
    <circle cx="820" cy="88" r="5" fill="#0B3C5D" fill-opacity="0.22"/>
  </svg>
</p>

<h1 align="center">Lupa Services &amp; Lupa Painting</h1>

<p align="center">
  <b>Production static website</b> • <b>SEO-first</b> • <b>Performance-focused</b> • <b>Accessibility-aware</b>
</p>

<p align="center">
  <img
    src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&pause=900&color=FFC400&center=true&vCenter=true&width=980&lines=Two+brands%2C+one+engineering+core.;Cleaning+%E2%80%A2+Painting+%E2%80%A2+SEO-first+%E2%80%A2+Performance-focused.;Apache%2FcPanel+deployment+%E2%80%A2+.htaccess+cache+policy+%E2%80%A2+SSL+ready."
    alt="Typing intro"
  />
</p>

<p align="center">
  <a href="https://lupaservices.com">
    <img alt="Production Live" src="https://img.shields.io/badge/Production-Live-0B3C5D?style=for-the-badge&logo=googlechrome&logoColor=white" />
  </a>
  <a href="https://github.com/danmarques127-sys/lupa-services">
    <img alt="GitHub Repository" src="https://img.shields.io/badge/GitHub-Repository-111827?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <a href="https://github.com/danmarques127-sys">
    <img alt="Author" src="https://img.shields.io/badge/Author-DaNgelo%20Marques-FFC400?style=for-the-badge&logo=github&logoColor=111827" />
  </a>
</p>

<p align="center">
  <img alt="Brand Cleaning" src="https://img.shields.io/badge/Brand-Cleaning%20(Lupa%20Services)-0B3C5D?style=for-the-badge&labelColor=0B3C5D&color=FFFFFF" />
  <img alt="Brand Painting" src="https://img.shields.io/badge/Brand-Painting%20(Lupa%20Painting)-FFC400?style=for-the-badge&labelColor=FFC400&color=FFFFFF" />
  <img alt="Hosting Apache cPanel" src="https://img.shields.io/badge/Hosting-Apache%20%2F%20cPanel-111827?style=for-the-badge&logo=apache&logoColor=white" />
</p>

<!-- Premium divider -->
<p align="center">
  <svg width="920" height="18" viewBox="0 0 920 18" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="divider">
    <defs>
      <linearGradient id="lupaGrad" x1="0" y1="0" x2="920" y2="0" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFFFFF" offset="0"/>
        <stop stop-color="#0B3C5D" offset="0.35"/>
        <stop stop-color="#FFC400" offset="0.70"/>
        <stop stop-color="#FFFFFF" offset="1"/>
      </linearGradient>
      <filter id="soft" x="-20%" y="-200%" width="140%" height="500%">
        <feGaussianBlur stdDeviation="2.2" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect x="20" y="8" width="880" height="2" rx="1" fill="url(#lupaGrad)" filter="url(#soft)"/>
    <circle cx="460" cy="9" r="4" fill="#FFC400" />
    <circle cx="460" cy="9" r="2" fill="#0B3C5D" />
  </svg>
</p>

---

## 🔍 Title + One-liner

**Lupa Services & Lupa Painting** — a production-ready static website for a real dual-service company, operating **Cleaning** and **Painting** under a unified, SEO-driven, performance-focused engineering architecture.

> Built and maintained by **DaNgelo Marques**  
> GitHub: https://github.com/danmarques127-sys

---

## 🔗 Live Links

- **Production:** https://lupaservices.com  
- **GitHub Repository:** https://github.com/danmarques127-sys/lupa-services  

---

## ✨ Features (3–6)

- **Dual-brand architecture** (Cleaning + Painting) sharing a single, consistent codebase
- **SEO-first static structure** (semantic HTML, metadata, clean internal linking)
- **Performance-focused delivery** with cache policy via **`.htaccess`**
- **Accessibility-aware layout** (semantic landmarks, readable hierarchy, mobile-first)
- **Deployment-ready** for **Apache/cPanel** with HTTPS (SSL enabled)

---

## 🎨 Brand System (Design Intent)

This project intentionally supports **two brands in one site**:

### Lupa Services — Cleaning
- Dark Blue `#0B3C5D`
- White `#FFFFFF`

### Lupa Painting
- Yellow `#FFC400`
- White `#FFFFFF`

### Shared language
- Dark blue for structure and trust  
- Yellow for CTAs, highlights, and motion  
- Clean white space for clarity and premium feel  

---

## 🧰 Tech Stack

<p align="center">
  <img alt="HTML5" height="44" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" />
  <img alt="CSS3" height="44" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" />
  <img alt="JavaScript" height="44" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" />
  <img alt="Apache" height="44" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg" />
  <img alt="Git" height="44" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" />
  <img alt="GitHub" height="44" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" />
  <img alt="HTTPS/SSL Secure" src="https://img.shields.io/badge/HTTPS%20%2F%20SSL-Secure-22C55E?style=for-the-badge&logo=letsencrypt&logoColor=white" />
</p>

- **HTML5** — semantic, SEO- and accessibility-oriented markup  
- **CSS3** — responsive layout, animations, and brand system  
- **Vanilla JavaScript** — lightweight interactions only  
- **Apache (.htaccess)** — cache control, compression, and static hosting behavior  
- **Git + GitHub** — versioning, release hygiene (tags/releases), collaboration  
- **HTTPS / SSL** — secure production deployment
- 
---

## 🗂️ Project Structure

> Production static-site layout — simple, portable, and predictable.

/
├── assets/
│ ├── css/ # Stylesheets
│ ├── js/ # JavaScript
│ ├── img/ # Images (flattened; no /images nesting)
│ └── icons/ # Icons + favicons (flattened; no /icons nesting)
│
├── seo/
│ ├── robots.txt
│ └── sitemap.xml
│
├── docs/
│ └── ARCHITECTURE.md
│
├── .htaccess
├── index.html
├── cleaning.html
├── painting.html
└── *.html

---

## 🚀 Deployment

### cPanel / Apache (Production)
1. Upload all files to `public_html/` (or domain root)
2. Ensure `.htaccess` is included and overrides are allowed
3. Confirm HTTPS / SSL is active
4. Validate internal links and assets on the live domain

---

## 🗄️ Cache Policy (2 lines)

- Static assets (CSS, JS, images, icons) are cached aggressively for repeat visits.  
- HTML documents use shorter cache to avoid stale content after updates.

---

## 📄 Documentation

- `docs/ARCHITECTURE.md` — explains routing, asset strategy, SEO decisions, and performance trade-offs.

---

## 📜 License (conscious choice)

**All Rights Reserved**

This repository represents a real client-grade production website.  
Reuse, redistribution, or modification is not permitted without explicit authorization.

---

## 👤 Author

**Dangelo Marques**  
Software Engineer • Web Architecture • SEO-driven Systems  
GitHub: https://github.com/danmarques127-sys

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:FFFFFF,60:FFC400,100:FFFFFF&height=120&section=footer" />
</p>

---

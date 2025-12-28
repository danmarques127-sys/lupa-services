<!--
  Lupa Services — README (Top-tier / Senior)
  Theme: Dark Blue + Dark Yellow + Off White
  Author: DaNgelo Marques (GitHub: danmarques127-sys)
-->

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:F8F9FA,35:0B3C5D,70:FFC400,100:F8F9FA&height=240&section=header&text=Lupa%20Services&fontSize=54&fontColor=111827&animation=fadeIn&fontAlignY=38&desc=Production%20static%20website%20%E2%80%A2%20SEO-first%20%E2%80%A2%20Performance-focused%20%E2%80%A2%20Accessibility-aware&descAlignY=64&descSize=18" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&pause=900&color=FFC400&center=true&vCenter=true&width=980&lines=Client-grade+static+site+for+a+real+service+business;Engineered+for+SEO%2C+speed%2C+and+reliability+on+Apache%2FcPanel;Dark+Blue+%26+Yellow+theme+for+GitHub;No+frameworks.+No+build+step.+Clean+delivery." />
</p>

<p align="center">
  <a href="https://lupaservices.com">
    <img src="https://img.shields.io/badge/Production-Live-0B3C5D?style=for-the-badge&logo=googlechrome&logoColor=white" />
  </a>
  <a href="https://github.com/danmarques127-sys/lupa-services">
    <img src="https://img.shields.io/badge/GitHub-Repository-111827?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <a href="https://github.com/danmarques127-sys">
    <img src="https://img.shields.io/badge/Author-DaNgelo%20Marques-F8F9FA?style=for-the-badge&logo=github&logoColor=0B3C5D" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Theme-Dark%20Blue%20%26%20Yellow-F8F9FA?style=for-the-badge&labelColor=0B3C5D&color=F8F9FA" />
  <img src="https://img.shields.io/badge/Brand-Lupa%20Services-F8F9FA?style=for-the-badge&labelColor=FFC400&color=F8F9FA" />
  <img src="https://img.shields.io/badge/Hosting-Apache%20%2F%20cPanel-111827?style=for-the-badge&logo=apache&logoColor=white" />
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=0:F8F9FA,50:0B3C5D,100:F8F9FA&height=2&section=header" />
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

## ✨ Features

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

### Production Deployment (Apache / cPanel)

The website is deployed on an Apache server with support for `.htaccess`
rules for caching, routing, and security headers.

Production environment considerations:
- Server must allow `.htaccess` overrides
- SEO assets (robots.txt, sitemap.xml) are publicly accessible
- All internal links and assets are validated post-deployment

---

## 🗄️ Cache Policy (2 lines)

- Static assets (CSS, JS, images, icons) are cached aggressively for repeat visits.  
- HTML documents use shorter cache to avoid stale content after updates.

---

## 📄 Documentation

- `docs/ARCHITECTURE.md` — explains routing, asset strategy, SEO decisions, and performance trade-offs.

---

## 📜 License 

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

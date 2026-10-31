# Lupa Painting — PHP Blog Deployment (GoDaddy)

The public blog is `https://lupaservices.com/blog.php`. It uses PHP and JSON storage, based on the Viana Commercial Services editorial system.

## Files and public routes

- `/blog.php`: published articles
- `/backend-blog/post.php?slug=...`: article
- `/backend-blog/login.php`: admin sign-in
- `/backend-blog/dashboard.php`: article management
- `/backend-blog/logout.php`: sign-out
- `/backend-blog/setup-admin.php`: first-run installer, **disabled by default**

## GoDaddy requirements

1. Host on a PHP 8.2+ plan with `fileinfo`, JSON, sessions and persistent writable storage.
2. Upload the PHP code and the `assets/css/blog-php.css` stylesheet to the website root.
3. Verify that `backend-blog/storage/` and `backend-blog/uploads/` are writable by PHP. Their `.htaccess` protections must be enforced by Apache.
4. Ensure the directory **above** `public_html` is writable when provisioning credentials; `blog-config.php` is created there and must never be published or committed.
5. To configure the initial account, temporarily set the PHP-host environment variable `BLOG_SETUP_ENABLED=1` and visit `/backend-blog/setup-admin.php` over HTTPS. Use a new unique password. **Disable `BLOG_SETUP_ENABLED` immediately afterward**; the installer is denied by default.
6. Test login, drafts, publishing, images, videos, article rendering, log-out, CSRF errors and unauthorized requests.
7. Back up `backend-blog/storage/posts.json` and `backend-blog/uploads/` regularly.

Do not reuse any previously disclosed password. Never commit credentials, configuration files or private uploads.

## Media hosting

The site refers to media using web paths such as `/assets/images/...` and `/assets/videos/...`. These files can be placed directly on the GoDaddy server without committing the large files to GitHub. Ensure deployment does **not** delete these server directories when uploading updated site code.

## Search visibility

The admin directory is disallowed in `robots.txt` and its pages use `noindex` headers. This is not an access control: login protection and server permissions remain mandatory.

The service-areas landing page is `/service-areas.html`. Only claim locations in which the business actually provides service. Avoid fake addresses and duplicate near-identical city pages.

## Status

Repository code is committed, but live GoDaddy PHP execution, user authentication, media permissions and production article publication have not been tested through this connection.

<?php
declare(strict_types=1);

if (!is_file(__DIR__ . '/bootstrap.php')) {
    http_response_code(503);
    exit('Missing bootstrap.php. Upload the entire backend-blog folder.');
}
require_once __DIR__ . '/bootstrap.php';
$privateConfig = dirname(__DIR__, 2) . '/blog-config.php';
if (is_file($privateConfig)) {
    require_once $privateConfig;
}
session_safe();

header('Cache-Control: no-store, private');
header('X-Robots-Tag: noindex, nofollow');

$error = '';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    verify_csrf();

    // Credentials live in the hosting environment, never in Git.
    $adminUsername = getenv('BLOG_ADMIN_USERNAME') ?: '';
    $adminPasswordHash = getenv('BLOG_ADMIN_PASSWORD_HASH') ?: '';
    $submittedUsername = trim((string) ($_POST['username'] ?? ''));
    $submittedPassword = (string) ($_POST['password'] ?? '');

    if (
        $adminUsername !== '' &&
        $adminPasswordHash !== '' &&
        hash_equals($adminUsername, $submittedUsername) &&
        password_verify($submittedPassword, $adminPasswordHash)
    ) {
        session_regenerate_id(true);
        $_SESSION['blog_admin'] = true;
        header('Location: /backend-blog/dashboard.php', true, 303);
        exit;
    }

    // Same public error whether credentials are wrong or not configured.
    $error = 'Unable to sign in. Check your credentials.';
}
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Blog Administration | Lupa Painting</title>
<link rel="stylesheet" href="/assets/css/blog-php.css">
</head>
<body>
<main class="panel">
<h1>Blog administrator</h1>
<p>Sign in to manage Lupa Painting articles.</p>
<?php if ($error !== ''): ?>
<p role="alert"><?= h($error) ?></p>
<?php endif; ?>
<form method="post" action="/backend-blog/login.php">
<input type="hidden" name="csrf" value="<?= h(csrf()) ?>">
<label for="admin-username">Username</label>
<input id="admin-username" required name="username" autocomplete="username" maxlength="128">
<label for="admin-password">Password</label>
<input id="admin-password" required type="password" name="password" autocomplete="current-password">
<button type="submit">Sign in</button>
</form>
</main>
</body>
</html>

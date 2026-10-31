<?php
declare(strict_types=1);

// One-time web installer. Available only until the private config exists.
// Upload the site and run setup immediately before sharing the URL.
require_once __DIR__ . '/bootstrap.php';
// Deny the first-run installer unless explicitly enabled on the hosting server.
if (getenv('BLOG_SETUP_ENABLED') !== '1') { http_response_code(403); exit('Administrator setup is disabled.'); }
session_safe();
header('Cache-Control: no-store, private');
header('X-Robots-Tag: noindex, nofollow');

$config = dirname(__DIR__, 2) . '/blog-config.php';
if (is_file($config)) {
    http_response_code(403);
    exit('Administrator already configured. <a href="/backend-blog/login.php">Sign in</a>.');
}
$error = '';
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    verify_csrf();
    $username = trim((string) ($_POST['username'] ?? ''));
    $password = (string) ($_POST['password'] ?? '');
    $confirm = (string) ($_POST['confirm'] ?? '');
    if (!preg_match('/^[a-zA-Z0-9_-]{4,64}$/', $username)) {
        $error = 'Username must be 4-64 letters, numbers, dashes or underscores.';
    } elseif (strlen($password) < 12) {
        $error = 'Password must have at least 12 characters.';
    } elseif (!hash_equals($password, $confirm)) {
        $error = 'Passwords do not match.';
    } else {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $body = "<?php\ndeclare(strict_types=1);\nputenv('BLOG_ADMIN_USERNAME=" . $username . "');\nputenv('BLOG_ADMIN_PASSWORD_HASH=" . $hash . "');\n";
        // Exclusive create means subsequent requests cannot overwrite credentials.
        $file = @fopen($config, 'x');
        if ($file === false) {
            $error = 'Could not create private configuration above public_html. Check hosting permissions or whether setup was already completed.';
        } else {
            $ok = fwrite($file, $body) === strlen($body);
            fflush($file);
            fclose($file);
            @chmod($config, 0600);
            if ($ok) {
                header('Location: /backend-blog/login.php?setup=complete', true, 303);
                exit;
            }
            $error = 'Could not write complete configuration. Contact hosting support.';
        }
    }
}
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Setup Blog Administrator | Lupa Painting</title>
<link rel="stylesheet" href="/assets/css/blog-php.css">
</head>
<body>
<main class="panel">
<h1>Set up blog administrator</h1>
<p>This page is only available before the administrator is configured. Create the account immediately after uploading the site.</p>
<?php if ($error !== ''): ?><p role="alert"><?= h($error) ?></p><?php endif; ?>
<form method="post" action="/backend-blog/setup-admin.php">
<input type="hidden" name="csrf" value="<?= h(csrf()) ?>">
<label for="username">Username</label>
<input id="username" name="username" required minlength="4" maxlength="64" pattern="[a-zA-Z0-9_-]+" value="vianacommercialservices" autocomplete="username">
<label for="password">New password (minimum 12 characters)</label>
<input id="password" name="password" type="password" required minlength="12" autocomplete="new-password">
<label for="confirm">Confirm password</label>
<input id="confirm" name="confirm" type="password" required minlength="12" autocomplete="new-password">
<button type="submit">Create administrator</button>
</form>
</main>
</body>
</html>

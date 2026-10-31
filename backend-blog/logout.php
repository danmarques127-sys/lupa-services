<?php
require __DIR__.'/bootstrap.php';session_safe();$_SESSION=[];session_destroy();header('Location: /backend-blog/login.php');exit;

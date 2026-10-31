<?php
declare(strict_types=1);
const DATA_FILE=__DIR__.'/storage/posts.json';
function h($s){return htmlspecialchars((string)$s,ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8');}
function session_safe(){
    if(session_status() !== PHP_SESSION_NONE) return;
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ||
        (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_set_cookie_params([
        'httponly' => true,
        'secure' => $https,
        'samesite' => 'Lax',
        'path' => '/'
    ]);
    if(!session_start()) throw new RuntimeException('Unable to start session');
}
function authorized(){session_safe();return !empty($_SESSION['blog_admin']);}
function csrf(){session_safe();return $_SESSION['csrf']??=bin2hex(random_bytes(24));}
function verify_csrf(){if(!hash_equals(csrf(),(string)($_POST['csrf']??''))){http_response_code(403);exit('Invalid request');}}
function posts($all=false){$a=is_file(DATA_FILE)?json_decode(file_get_contents(DATA_FILE),true):[];if(!is_array($a))$a=[];if(!$all)$a=array_values(array_filter($a,fn($p)=>($p['status']??'')==='published'));usort($a,fn($x,$y)=>strcmp($y['date']??'',$x['date']??''));return $a;}
function save_posts($a){if(!is_dir(dirname(DATA_FILE)))mkdir(dirname(DATA_FILE),0750,true);$f=fopen(DATA_FILE,'c+');if(!$f||!flock($f,LOCK_EX))throw new RuntimeException('Storage unavailable');ftruncate($f,0);rewind($f);fwrite($f,json_encode($a,JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE));fflush($f);flock($f,LOCK_UN);fclose($f);}
function upload_media($f){if(!is_array($f)||($f['error']??4)===4)return '';if($f['error']!==0||$f['size']>20*1024*1024)throw new RuntimeException('Upload failed or larger than 20 MB');$mime=(new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);$ext=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp','video/mp4'=>'mp4','video/webm'=>'webm'];if(!isset($ext[$mime]))throw new RuntimeException('Unsupported media');$dir=__DIR__.'/uploads';if(!is_dir($dir))mkdir($dir,0755,true);$name=bin2hex(random_bytes(16)).'.'.$ext[$mime];if(!move_uploaded_file($f['tmp_name'],$dir.'/'.$name))throw new RuntimeException('Cannot save upload');return '/backend-blog/uploads/'.$name;}

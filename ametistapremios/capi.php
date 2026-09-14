<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['ok' => false]);
    exit;
}

$host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
$origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
if ($origin !== '') {
    $originHost = strtolower((string) (parse_url($origin, PHP_URL_HOST) ?? ''));
    $requestHost = preg_replace('/:\\d+$/', '', $host);
    if ($originHost === '' || $originHost !== $requestHost) {
        http_response_code(403);
        echo json_encode(['ok' => false]);
        exit;
    }
}

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 4096) {
    http_response_code(400);
    echo json_encode(['ok' => false]);
    exit;
}

$input = json_decode($raw, true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['ok' => false]);
    exit;
}

$pixelId = '4177351775901177';
$accessToken = getenv('META_CAPI_TOKEN') ?: '';
if ($accessToken === '') {
    http_response_code(503);
    echo json_encode(['ok' => false, 'reason' => 'server_not_configured']);
    exit;
}

$eventId = preg_replace('/[^a-zA-Z0-9_.-]/', '', (string) ($input['event_id'] ?? ''));
if ($eventId === '' || strlen($eventId) > 100) {
    http_response_code(400);
    echo json_encode(['ok' => false]);
    exit;
}

$forwarded = explode(',', (string) ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? ''));
$clientIp = trim((string) ($_SERVER['HTTP_CF_CONNECTING_IP'] ?? $forwarded[0] ?? $_SERVER['REMOTE_ADDR'] ?? ''));
$event = [
    'event_name' => 'Lead',
    'event_time' => time(),
    'event_id' => $eventId,
    'action_source' => 'website',
    'event_source_url' => 'https://' . $host . '/ametistapremios/',
    'user_data' => array_filter([
        'client_ip_address' => filter_var($clientIp, FILTER_VALIDATE_IP) ? $clientIp : '',
        'client_user_agent' => (string) ($_SERVER['HTTP_USER_AGENT'] ?? ''),
        'fbc' => substr((string) ($input['fbc'] ?? ''), 0, 255),
        'fbp' => substr((string) ($input['fbp'] ?? ''), 0, 255),
    ]),
];

$payload = json_encode(['data' => [$event]], JSON_UNESCAPED_SLASHES);
$endpoint = "https://graph.facebook.com/v26.0/{$pixelId}/events";
$curl = curl_init($endpoint);
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/json',
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 3,
    CURLOPT_TIMEOUT => 6,
    CURLOPT_SSL_VERIFYPEER => true,
]);

$response = curl_exec($curl);
$status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

http_response_code($status > 0 ? $status : 502);
echo $response !== false ? $response : json_encode(['ok' => false]);

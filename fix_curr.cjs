const { Client } = require('ssh2');
const config = { host: '62.72.25.117', port: 65002, username: 'u256167180', password: '4_m_XMkgux@.AgC' };
const conn = new Client();
conn.on('ready', () => {
    conn.exec('cd domains/sukounalbunyan.ae/public_html/backend && echo "PD9waHAKcmVxdWlyZSBfX0RJUl9fIC4gJy92ZW5kb3IvYXV0b2xvYWQucGhwJzsKXCA9IHJlcXVpcmVfb25jZSBfX0RJUl9fIC4gJy9ib290c3RyYXAvYXBwLnBocCc7ClwgPSBcLT5tYWtlKElsbHVtaW5hdGVcQ29udHJhY3RzXENvbnNvbGVcS2VybmVsOjpjbGFzcyk7ClwtPmJvb3RzdHJhcCgpOwoKXEFwcFxNb2RlbHNcU2V0dGluZzo6d2hlcmUoJ2tleScsICdkZWZ1bHRfY3VycmFuY3lfc3ltYm9sJyktPnVwZGF0ZShbJ3ZhbHVlJyA9PiAn2K8u2KUnXSk7ClxBcHBcTW9kZWxzXFNldHRpbmc6OndoZXJlKCdrZXknLCAnY3VycmVuY3lfc3ltYm9sJyktPnVwZGF0ZShbJ3ZhbHVlJyA9PiAn2K8u2KUnXSk7ClxBcHBcTW9kZWxzXFNldHRpbmc6OndoZXJlKCdrZXknLCAnY3VycmVuY3lTeW1ib2wnKS0+dXBkYXRlKFsndmFsdWUnID0+ICfYry7YpSddKTsKXEFwcFxNb2RlbHNcU2V0dGluZzo6d2hlcmUoJ2tleScsICdkZWZ1bHRfY3VycmFuY3knKS0+dXBkYXRlKFsndmFsdWUnID0+ICdBRUQnXSk7ClxBcHBcTW9kZWxzXFNldHRpbmc6OndoZXJlKCdrZXknLCAnZGVmYXVsdEN1cnJlbmN5JyktPnVwZGF0ZShbJ3ZhbHVlJyA9PiAnQUVEJ10pOwplY2hvICJDdXJyZW5jeSBGaXhlZC5cbiI7" | base64 -d > fix_currency.php && /opt/alt/php82/usr/bin/php fix_currency.php && /opt/alt/php82/usr/bin/php artisan cache:clear && rm fix_currency.php', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => { conn.end(); }).on('data', (data) => { process.stdout.write(data); }).stderr.on('data', (data) => { process.stderr.write(data); });
    });
}).connect(config);

# Runtime Model

## Local Environment
- **Web Server**: XAMPP (Apache/Nginx context expected for PHP 8.2).
- **Database**: MySQL.
- **Cache / Session**: Database/Log / File driven primarily (as per `.env.example`).
- **Asset Compilation**: Vite Dev Server with HMR running on `localhost`.

## Production Environment
- **Hosting Target**: Hostinger.
- **Web Server**: Apache/Nginx (inferred from Hostinger standard).
- **Database**: Remote MySQL instance (`HOSTINGER_DB_*` configs).

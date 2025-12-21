This is a forum. You can host a version of it yourself by cloning the repository and running `docker compose up -d` in the directory where you cloned it to.

To set this up, you need to have docker installed and a domain name. Then run docker compose up in the directory where you downloaded this. Then navigate to your website, and go to the port 5001 (this can changed in docker-compose.yml) and set up your SSL certificates and the proxy.

An SSL certificate can be set up in the certificates tab. Select LetsEncrypt with HTTPS and enter your domain name. To set up the proxy, go to the hosts dropdown and set Proxy Hosts. The domain name would be your domain name and the hostname is `backend-nodejs` and the port is 3000. Then go to the SSL tab in the pop up menu and select Force SSL. After that, the website should be working.

The database is stored in backend/db/database.db using sqlite. There are 3 tables: comments whcich contains the user id, content, and creation time, users which includes hashed password, username, display name, and color, and sessions, which includes the stuff required for session management.

Passwords are sent securely and are hahsed using argon2 before being stored in the databse. Passwords have the standard requirements of greater than 8 characters, requiring a number, capital and lowercase letter and a symbol.

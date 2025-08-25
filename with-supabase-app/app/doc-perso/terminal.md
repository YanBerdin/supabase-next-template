# Terminal aout 2025

```bash
yandev@LAPTOP-CE57E7VI:~/projets/supabase-next-template/with-supabase-app$
yandev@LAPTOP-CE57E7VI:~/projets/supabase-next-template/with-supabase-app$ supabase db push
supabase: command not found
yandev@LAPTOP-CE57E7VI:~/projets/supabase-next-template/with-supabase-app$ pnpm dlx supabase db push
 WARN  1 deprecated subdependencies found: node-domexception@1.0.0
Packages: +26
++++++++++++++++++++++++++
Progress: resolved 26, reused 12, downloaded 14, added 26, done
 WARN  Failed to create bin at /home/yandev/.cache/pnpm/dlx/9042d9bb544ed1a9b6290de819aae9b23bc26988444cc1613e382bcf65f08698/198deb2a3d1-1143f/node_modules/.pnpm/supabase@2.34.3/node_modules/supabase/node_modules/.bin/supabase. ENOENT: no such file or directory, open '/home/yandev/.cache/pnpm/dlx/9042d9bb544ed1a9b6290de819aae9b23bc26988444cc1613e382bcf65f08698/198deb2a3d1-1143f/node_modules/.pnpm/supabase@2.34.3/node_modules/supabase/bin/supabase'
.cache/pnpm/dlx/9042d9bb544ed1a9b6290de819aae9b23bc26988444cc1613e382bcf65f08698/198deb2a3d1-1143f/node_modules/.pnpm/supabase@2.34.3/node_modules/s.cache/pnpm/dlx/9042d9bb544ed1a9b6290de819aae9b23bc26988444cc1613e382bcf65f08698/198deb2a3d1-1143f/node_modules/.pnpm/supabase@2.34.3/node_modules/supabase: Running postinstall script, done in 21.5s
Cannot find project ref. Have you run supabase link?
Try rerunning the command with --debug to troubleshoot the error.
yandev@LAPTOP-CE57E7VI:~/projets/supabase-next-template/with-supabase-app$ pnpm dlx supabase link
Selected project: ahvrzmgaieupgliswbkj
Initialising cli_login_postgres role...
Connecting to remote database...
NOTICE (42P06): schema "supabase_migrations" already exists, skipping
Finished supabase link.
WARNING: Local config differs from linked project. Try updating supabase/config.toml
diff supabase/config.toml ahvrzmgaieupgliswbkj
--- supabase/config.toml
+++ ahvrzmgaieupgliswbkj
@@ -13,7 +13,7 @@
 [db]
 port = 54322
 shadow_port = 54320
-major_version = 17
+major_version = 15
 root_key = ""
 [db.pooler]
 enabled = false
@@ -58,8 +58,8 @@
 
 [auth]
 enabled = true
-site_url = "http://127.0.0.1:3000"
-additional_redirect_urls = ["https://127.0.0.1:3000"]
+site_url = "http://localhost:3000"
+additional_redirect_urls = []
 jwt_expiry = 3600
 enable_refresh_token_rotation = true
 refresh_token_reuse_interval = 10
@@ -84,8 +84,8 @@
 [auth.mfa]
 max_enrolled_factors = 10
 [auth.mfa.totp]
-enroll_enabled = false
-verify_enabled = false
+enroll_enabled = true
+verify_enabled = true
 [auth.mfa.phone]
 enroll_enabled = false
 verify_enabled = false
@@ -101,11 +101,11 @@
 [auth.email]
 enable_signup = true
 double_confirm_changes = true
-enable_confirmations = false
+enable_confirmations = true
 secure_password_change = false
-max_frequency = "1s"
-otp_length = 6
-otp_expiry = 3600
+max_frequency = "1m0s"
+otp_length = 6
+otp_expiry = 86400
 [auth.email.template]
 [auth.sms]
 enable_signup = false

yandev@LAPTOP-CE57E7VI:~/projets/supabase-next-template/with-supabase-app$ pnpm dlx supabase db push
Initialising cli_login_postgres role...
Connecting to remote database...
Remote database is up to date.
yandev@LAPTOP-CE57E7VI:~/projets/supabase-next-template/with-supabase-app$ 
```

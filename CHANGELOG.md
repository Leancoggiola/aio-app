# [1.0.0-rc.5](https://github.com/Leancoggiola/aio-app/compare/v1.0.0-rc.4...v1.0.0-rc.5) (2026-05-14)

### Bug Fixes

- **api:** do more controlled deploys ([78b70e6](https://github.com/Leancoggiola/aio-app/commit/78b70e69f59196b16dc8cee88aa9950f25fa1cb7))
- **api:** install prisma locally in Docker runner for migrate deploy ([0ad4324](https://github.com/Leancoggiola/aio-app/commit/0ad4324f60eb866cf0bef3d973a9b083135d5edc))

# [1.0.0-rc.4](https://github.com/Leancoggiola/aio-app/compare/v1.0.0-rc.3...v1.0.0-rc.4) (2026-05-14)

### Bug Fixes

- **api:** install prisma globally in Docker runner for migrate deploy ([e750353](https://github.com/Leancoggiola/aio-app/commit/e75035398fac5ee19d418d4428e2c20c932ca9ed))

# [1.0.0-rc.3](https://github.com/Leancoggiola/aio-app/compare/v1.0.0-rc.2...v1.0.0-rc.3) (2026-05-14)

### Bug Fixes

- **api:** dockerfile ([8c89c6f](https://github.com/Leancoggiola/aio-app/commit/8c89c6f0776a2c71af686a10340c85b9c59106df))

# [1.0.0-rc.2](https://github.com/Leancoggiola/aio-app/compare/v1.0.0-rc.1...v1.0.0-rc.2) (2026-05-14)

### Bug Fixes

- **api:** removed deprecated methods ([3a55a5b](https://github.com/Leancoggiola/aio-app/commit/3a55a5ba894fd3faec8747e1a23d969902b17e7d))

### Features

- access control with username auth and deployment config ([#15](https://github.com/Leancoggiola/aio-app/issues/15)) ([5b1e6a7](https://github.com/Leancoggiola/aio-app/commit/5b1e6a7398434bc30290ca7dfc9da114dcf166c6))
- **api:** add admin routes, guard, and service for user management ([d014ffe](https://github.com/Leancoggiola/aio-app/commit/d014ffece38bd86b9ba8f62b1a5480bc9b43f50e))
- **api:** add admin seed script with prisma.config.ts integration ([ebfa8e7](https://github.com/Leancoggiola/aio-app/commit/ebfa8e74ce5edf24d60926bb34db0ccbd37f5f08))
- **api:** add username, role enum, make email optional in schema ([153bd9f](https://github.com/Leancoggiola/aio-app/commit/153bd9f27ce377cac80e50a79821b63ddd0d722c))
- **ci:** update render.yaml, Dockerfile startup migrations, update TODO ([1002fee](https://github.com/Leancoggiola/aio-app/commit/1002fee1b5957c74daeddedca374b0ca34bedab0))

# 1.0.0-rc.1 (2026-05-13)

### Bug Fixes

- add rate limiting, fix CORS, and Spanish messages ([ca06cf3](https://github.com/Leancoggiola/aio-app/commit/ca06cf3fc151d1865a5e9b06383e441b53126b40))
- **api:** fix Dockerfile PNPM_HOME and .dockerignore symlink issue ([ab7794c](https://github.com/Leancoggiola/aio-app/commit/ab7794cae6150efbc85b495838e1a70e38ff7455))
- **api:** resolve Docker runtime issues with pnpm deploy and shared package bundling ([26d4ef6](https://github.com/Leancoggiola/aio-app/commit/26d4ef665a3643c6dd51bb11124f0ea04c889df1))
- **ci:** add dummy DATABASE_URL for prisma generate in CI ([c29ffb7](https://github.com/Leancoggiola/aio-app/commit/c29ffb7ff6be1b2c4c20a9a7861400ba8e1469ad))
- **ci:** group security updates into single PR per ecosystem ([aab9512](https://github.com/Leancoggiola/aio-app/commit/aab9512426ab73a73aaabb70eb8404852a2c71eb))
- **ci:** replace invalid Dependabot property with open-pull-requests-limit 0 ([#14](https://github.com/Leancoggiola/aio-app/issues/14)) ([5f6c706](https://github.com/Leancoggiola/aio-app/commit/5f6c706cf79f2ae580c8e5edbce38a273e907b51))
- **ci:** replace invalid security-updates-only with limit 0 ([3a612e2](https://github.com/Leancoggiola/aio-app/commit/3a612e2a3bfaab8db34615fc2f7ff5ebae5cfbe1))
- **ci:** run prisma generate before check-types in turbo pipeline ([e5c087e](https://github.com/Leancoggiola/aio-app/commit/e5c087ea4e68e2eff97cacf794796c30cea01dc1))
- **ci:** use process.env for prisma config and rename generate task to db:generate ([e495f45](https://github.com/Leancoggiola/aio-app/commit/e495f45525aa761cc44b7354edfc0fbaaa849c6b))
- use relative path in root tsconfig extends ([eb8a746](https://github.com/Leancoggiola/aio-app/commit/eb8a7463c0eb8941ce1eaa6b60fca5698b5245e0))

### Features

- añadido config de media ([a05515f](https://github.com/Leancoggiola/aio-app/commit/a05515f591acc02139d1d2cd27971960287a37fd))
- **api:** add health endpoint and document deployment setup in TODO ([3b6d41f](https://github.com/Leancoggiola/aio-app/commit/3b6d41f805f253bfe5bc7795ce68d9b2cf233cce))
- **api:** add pino structured logging and VSCode workspace config ([04e27d2](https://github.com/Leancoggiola/aio-app/commit/04e27d2fa0aa0ab8dd851765b75794a2c5f927b9))
- dependencies fix ([0accb9c](https://github.com/Leancoggiola/aio-app/commit/0accb9c560f69728b68ed81bb83db64f215dbd7e))
- rework and next steps ([822f115](https://github.com/Leancoggiola/aio-app/commit/822f1150a4826021dac2992b8ff00ab1ba81aaaa))
- supabase and jwt improvements ([6c01a7a](https://github.com/Leancoggiola/aio-app/commit/6c01a7a1a20413d267390a4179bdfcbd2686d813))

# Security Policy

## Supported versions

Bar Compass is a small personal project. Only the latest version on the `main`
branch receives fixes.

| Version | Supported |
| ------- | --------- |
| latest (`main`) | ✅ |
| older builds | ❌ |

## Reporting a vulnerability

If you discover a security or privacy issue, please report it **privately**
rather than opening a public issue:

- Email: **aboerum@gmail.com** with the subject line `Bar Compass security`.
- Or use GitHub's [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
  if the repository has it enabled.

Please include:

- A description of the issue and its impact.
- Steps to reproduce (a proof of concept if possible).
- The platform and app/SDK version where you saw it.

I'll aim to acknowledge reports within a few days. Since this is a hobby project,
fixes are best-effort.

## Scope

Because Bar Compass has **no backend and makes no network calls**, the realistic
attack surface is limited. Relevant areas include:

- **Local data handling** — the saved home location stored in AsyncStorage
  (`barcompass:home`). It is stored unencrypted in app-private storage, which is
  standard for non-sensitive on-device data.
- **Dependency vulnerabilities** — issues in Expo, React Native, or other npm
  packages listed in `package.json`.
- **Permission misuse** — anything causing location data to be transmitted or
  persisted beyond what's described in [PRIVACY.md](./PRIVACY.md).

## Out of scope

- Issues requiring a rooted/jailbroken device or physical access to an unlocked
  phone.
- The accuracy of compass/GPS hardware or bar coordinates (open a normal issue
  for those).
- Social-engineering or denial-of-service against third-party OS geocoders.

## Dependency hygiene

This project pins dependency versions in `package.json`. To audit them locally:

```bash
npm audit
```

Note that some advisories surface only in transitive dev/build tooling and may
not affect the shipped app.

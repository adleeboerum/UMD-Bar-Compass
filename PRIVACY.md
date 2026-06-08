# Privacy Policy — Bar Compass

_Last updated: 2026-06-08_

Bar Compass is built to be private by default. The short version: **your data
never leaves your phone.**

## What the app accesses

- **Location (while in use).** Bar Compass reads your GPS position and compass
  heading to calculate the direction and distance to your selected destination.
  This happens entirely on your device, in real time, only while the app is
  open. Location is never transmitted, logged, or stored anywhere.
- **Home address (optional).** If you choose to "Set home," the address you type
  is converted to coordinates using the operating system's on-device geocoder
  (`expo-location`). The resulting label and coordinates are saved **locally**
  on your device via AsyncStorage under the key `barcompass:home`. You can remove
  it at any time with "Remove saved home."

## What the app does NOT do

- ❌ No accounts, logins, or sign-ups.
- ❌ No analytics, telemetry, crash reporting, or advertising SDKs.
- ❌ No network requests to any Bar Compass server — there is no server.
- ❌ No selling, sharing, or transmitting of your location or address.
- ❌ No background location tracking. Location access is "while in use" only.

## Third parties

Bar Compass makes no calls to third-party services. Address geocoding is handled
by your device's operating system (Apple / Google), governed by their respective
privacy policies. The app does not send your address to any service Bar Compass
controls.

## Data deletion

All app data lives only on your device. To delete it:

- Tap **Set home → Remove saved home**, or
- Delete the app, which removes all locally stored data.

## Children's privacy

Bar Compass is intended for adults of legal drinking age and is not directed at
children.

## Permissions reference

| Permission | Why | Scope |
| ---------- | --- | ----- |
| Location (when in use) | Compute live direction/distance to a destination | On-device only, never transmitted |

## Contact

Questions about privacy? Open an issue, or email **aboerum@gmail.com**.

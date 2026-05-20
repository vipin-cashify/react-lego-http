# @reglobe/lego-http

Native-only HTTP client initialization for Lego apps. Provides `initializeHttpNative` with user-auth and referrer interceptors.

## Usage

```ts
import { initializeHttpNative } from '@reglobe/lego-http';
import { LegoServiceType } from '@reglobe/lego-core/lego-service/lego-service-type';

initializeHttpNative(LegoServiceType.MAIN, true, undefined, bundleVersion, buildVersion);
```

## Peer dependencies

- `@reglobe/lego-core`
- `@reglobe/lego-fetch`
- `@reglobe/lego-storage`

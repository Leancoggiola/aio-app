# @aio-app/shared

Shared types, DTOs, and constants for the AIO App monorepo.

This is a **Just-in-Time Package** - it exports TypeScript directly without a build step.
The consuming applications' bundlers (Vite for web, ts-node for API) will compile it.

## Usage

```typescript
// Import types
import type { MediaItem, MediaType } from '@aio-app/shared/types/media';

// Import DTOs
import type { CreateMediaItemDto } from '@aio-app/shared/dtos/media';

// Import constants
import { MEDIA_TYPES, MEDIA_STATUSES } from '@aio-app/shared/constants';
```

## Development

```bash
# Type checking
yarn workspace @aio-app/shared check-types

# Linting
yarn workspace @aio-app/shared lint
```

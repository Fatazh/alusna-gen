# Module Boundaries

## Ownership map

| Module                   | Owns                                                                                 | May depend on                                    | Must not own                               |
| ------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------ | ------------------------------------------ |
| `app`                    | Bootstrap, providers, layout, route composition, SEO lifecycle                       | Feature public APIs, shared UI/config, store     | Color algorithms, export serializers       |
| `features/color`         | Color types, conversions, harmony, matching, shades, accessibility, image palette UI | Shared UI/lib, color store slice                 | Typography upload, Brand Kit orchestration |
| `features/typography`    | Font catalog, safe font loading, upload validation, pairing and preview              | Shared UI/lib, typography store slice            | Brand Kit generation                       |
| `features/design-system` | Token model, generation, CSS/JSON/Tailwind/SCSS/React Native serializers             | Public color types/utilities, shared UI          | Brand Kit form state, routing              |
| `features/brand-kit`     | Brand composition, guidelines, accessibility report, import/export workflows         | Public color, typography, and design-system APIs | Global routing and SEO lifecycle           |
| `store`                  | Persistence adapter, migrations, shared slices, storage limits                       | Serializable domain types and shared utilities   | Rendering and DOM work                     |
| `shared`                 | Generic UI, generic hooks, brand config, framework-neutral helpers                   | Third-party packages only                        | Feature-specific business logic            |

## Public API rule

Every migrated feature exposes supported dependencies through `features/<name>/index.ts`. Imports such as the following are forbidden outside the owning feature:

```ts
import { internalThing } from "../features/color/model/internalThing";
```

Consumers use:

```ts
import { publicThing } from "../features/color";
```

## State ownership

Persist only data that must survive reloads:

- theme;
- saved colors;
- named palettes;
- uploaded font metadata and accepted local font data;
- saved Brand Kits.

Keep these ephemeral unless a product requirement changes:

- active tabs;
- open dialogs;
- form validation messages;
- temporary image pixels;
- generated previews that can be recomputed.

## File-size guidance

Line count is a signal, not a hard quality metric:

- Around 250 lines: review whether responsibilities are still cohesive.
- Around 400 lines: splitting requires an explicit decision or justification.
- Do not split pure data tables or cohesive serializers merely to satisfy a line target.

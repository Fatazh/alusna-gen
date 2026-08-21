# ADR 006: Trust Pages and Transparent Advertising

- Status: Accepted
- Date: 2026-08-21

## Context

ALUSNA plans to remain free while using low-maintenance advertising or sponsorship. Activating third-party ad scripts before publishing accurate privacy, terms, contact, and advertising disclosures would create avoidable trust and compliance risk.

## Decision

- Publish static About, Privacy, Terms, and Advertising Policy routes before third-party ad scripts.
- Keep direct sponsor/affiliate placement opt-in through build-time environment configuration.
- Fail closed when the destination URL or visible sponsor label is invalid or missing.
- Label commercial placement as `Iklan / Sponsor`, use `rel="sponsored noopener noreferrer"`, and link to the advertising policy.
- Do not load a third-party ad network, cookies, or advertising identifiers until a real provider is selected and its consent/privacy requirements are implemented.
- Keep advertising separate from tool algorithms and generated results.

## Consequences

- The repository is ready for direct sponsor or affiliate configuration but does not claim active revenue.
- A future ad-network integration requires a new review of CSP, consent, privacy text, provider terms, and regional requirements.
- Production launch still requires a real origin and public contact channel.

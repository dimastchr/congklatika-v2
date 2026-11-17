# CongklaTika Firestore Security Specification (Phase 0)

## 1. Data Invariants
1. **Identity & Ownership**: Every `/players/{playerId}` document MUST have `playerId == request.auth.uid` and `ownerUid == request.auth.uid`. Unauthenticated callers have zero read or write access.
2. **Master Gate on Subcollections**: Every `/players/{playerId}/quiz_attempts/{attemptId}` document MUST verify parent ownership via `get(/databases/$(database)/documents/players/$(playerId)).data.ownerUid == request.auth.uid`, plus `ownerUid == request.auth.uid`.
3. **Atomic Handle Binding**: Creating a `/usernames/{username}` reservation MUST match `username == incoming().username`, `ownerUid == request.auth.uid`, and atomically pair with `/players/$(request.auth.uid)` via `existsAfter(...)`.
4. **No Plaintext Credentials**: PINs are never stored in Firestore. Credential verification occurs server-side in Firebase Auth.
5. **Immutable Identity & Audit Fields**: `ownerUid`, `username`, `authMethod`, and `createdAt` cannot change after creation. `quiz_attempts` records are append-only immutable records (`allow update: if false`).
6. **Strict Schema & Bounds**: Every string validates `.size()`, arrays are capped (`level*Done.size() <= 6`, `legacyUnlockedLevels.size() <= 2`), enums are closed allowlists, and `createdAt`/`updatedAt`/`recordedAt` must match `request.time`.
7. **Zero Blanket Reads / No Enumeration**: `allow list: if false` on `/usernames`, and `/players` list queries must evaluate `resource.data.ownerUid == request.auth.uid`.

## 2. The "Dirty Dozen" Adversarial Payloads (All Must Return PERMISSION_DENIED)
1. **Unauthenticated Read**: Anonymous (unauthenticated) `get` on `/players/userA`.
2. **Cross-User Profile Hijack**: Authenticated `userB` attempts `create` on `/players/userA` with `ownerUid: "userB"`.
3. **OwnerUID Spoofing**: Authenticated `userB` creates `/players/userB` with `ownerUid: "userA"`.
4. **Shadow Field Injection**: Authenticated `userA` creates `/players/userA` adding ghost field `isAdmin: true`.
5. **Oversized DisplayName Poisoning**: `userA` updates `/players/userA` with `displayName` of length 25+ chars.
6. **Forged CreatedAt Timestamp**: `userA` creates `/players/userA` with `createdAt` in the past instead of `request.time`.
7. **Immutable Username Mutation**: `userA` updates `/players/userA` attempting to change `username` or `ownerUid` or `createdAt`.
8. **Unbounded Level Array Poisoning**: `userA` sets `level1Done` to 7+ items or non-string first element `[123]`.
9. **Orphaned Username Squatting**: `userA` creates `/usernames/taken_name` without atomically creating `/players/userA` in the same batch.
10. **Blanket Username Enumeration**: `userA` runs a `list` query on `/usernames`.
11. **Subcollection Cross-Tenant Write**: `userB` attempts to `create` `/players/userA/quiz_attempts/att1` claiming `ownerUid: "userB"`.
12. **Quiz Score Tampering via Update**: `userA` attempts to `update` an already recorded `/players/userA/quiz_attempts/att1` document.

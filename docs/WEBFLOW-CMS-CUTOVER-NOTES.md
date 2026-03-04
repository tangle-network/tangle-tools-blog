# Webflow CMS Cutover Notes

## Recommendation (forms/email collection before downgrade)
Keep Webflow form collection **enabled** until the replacement form endpoint and notification flow are live and verified in production. Do **not** delete form settings before downgrade.

## Why
Downgrading or removing Webflow form collection too early can create silent lead loss (submissions accepted in UI but not delivered), and historical form entries can become inaccessible depending on plan/features retained.

## Safe cutover order
1. Freeze content edits in Webflow CMS (announce a short editorial freeze window).
2. Export and archive all existing form submissions (CSV + secure backup).
3. Implement the replacement form collection path (new endpoint, inbox/webhook notifications, spam controls).
4. Run end-to-end production tests with real email addresses and duplicate monitoring.
5. Keep Webflow form collection active for a short overlap window (recommended: 3-7 days) while dual-monitoring submission counts.
6. Verify parity: no submission loss, notifications received, and storage retention confirmed.
7. Disable/delete Webflow form collection only after parity checks pass.
8. Downgrade Webflow plan after cutover sign-off and backup confirmation.

## Minimum rollback plan
- If submission volume drops unexpectedly after cutover, re-enable the previous Webflow form immediately.
- Keep DNS/routing and form embed rollback steps documented before starting cutover.

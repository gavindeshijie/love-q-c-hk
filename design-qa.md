**Findings**
- No P0/P1/P2 issues remain for the current mobile landing screen.

**Source Visual Truth**
- `/tmp/codex-remote-attachments/019efd71-fb8e-7d91-8a28-6cbb372caad1/2906C960-B99D-4737-9CD0-D0C3672CFED9/1-照片-1.jpg`

**Implementation Evidence**
- Local URL: `http://127.0.0.1:8091/`
- Implementation screenshot: `/private/tmp/love-border-v28.png`
- Tall mobile height screenshot: `/private/tmp/love-height-after-393x852.png`
- Common mobile height screenshot: `/private/tmp/love-height-after-390x740.png`
- Reference-height regression screenshot: `/private/tmp/love-height-after-427x640.png`
- Card-zone comparison: `/private/tmp/card-zone-compare-v28.png`
- Focused top comparison: `/private/tmp/love-focus-top-v17.png`
- Focused card comparison: `/private/tmp/love-focus-cards-v17.png`
- Focused bottom comparison: `/private/tmp/love-focus-bottom-v17.png`
- Viewport: `427x640`, `deviceScaleFactor: 2`, mobile viewport.
- State: default page load, Chinese card selected.

**Required Fidelity Surfaces**
- Fonts and typography: heading, language labels, currencies, and price lines match the visual hierarchy and wrapping of the reference. The implementation uses browser-safe multilingual font fallbacks, so exact antialiasing can vary by device.
- Spacing and layout rhythm: six language cards, header block, and bottom feature strip align to the reference mobile composition. No visible text overflow or card overlap remains.
- Tall mobile height behavior: high browser viewports no longer leave a large empty section beneath the feature strip; a responsive floor-grid extension fills the lower area while preserving the card layout.
- Colors and visual tokens: dark violet/black neon palette, purple glows, white text, red flags, and floor lighting are consistent with the reference.
- Image quality and asset fidelity: the six flags are individual image assets cropped from the supplied visual instead of CSS approximations. The card border now uses a separate transparent single-card frame asset, not the full reference image as a page background.
- Copy and content: all visible language labels, pricing labels, and service benefit text match the reference.

**Patches Made Since Previous QA Pass**
- Rebalanced the top header: smaller title text, higher text block, and restored spacing before the language grid.
- Reworked the language grid proportions: slightly narrower than the first build, shorter than the deployed v8 build, and better aligned to the reference's bottom feature strip.
- Enlarged the flag display while preserving the separate PNG flag assets.
- Reduced background dot brightness and side-city intensity so the cards dominate like the reference.
- Replaced the softer card outline with a thicker octagonal neon frame and added subtle segmented corner rails.
- Kept all visible language/card text as editable HTML text instead of baking it into the image.
- Added a darker world-map/globe layer behind the header so the top reads closer to the reference without using the original full screenshot as a background.
- Added editable side signage (`SSL TRADE` and `SECRET LANGUAGE TRADE`) to match the reference's left/right container details.
- Reworked the side city treatment to be darker and less ladder-like.
- Compressed the language card heights and adjusted grid spacing after comparison against the reference and local screenshots.
- Reduced the top wing size/brightness so it sits behind the title instead of dominating it.
- Replaced the hand-built segmented border with `public/assets/card-frame-reference.png`, a transparent card-frame asset extracted from the supplied reference so the metallic corner pattern and neon rail texture are closer to the source.
- Rebalanced the card grid after adding the transparent frame asset: narrower card columns, taller card boxes, reduced excess purple fill, and darker inner panels.
- Increased the flag size and spacing below each flag so the editable text sits lower inside the frame like the reference.
- Kept all card labels, currency labels, pricing text, side signage, and footer benefit text editable in HTML; only decorative flags and the standalone frame are image assets.
- Added a high-viewport floor-grid extension below the feature strip so tall phones do not show a large blank lower section.

**Follow-up Polish**
- P3: the background city/globe is still a code-built approximation, not the same photo-level detail as the source image. This is the largest remaining visual difference because the full original image is intentionally not used as the page background.

**Implementation Checklist**
- Use the current `public/index.html`.
- Include `public/assets/flag-china.png`, `flag-singapore.png`, `flag-thailand.png`, `flag-vietnam.png`, `flag-malaysia.png`, and `flag-laos.png`.
- Keep `public/CNAME` as `love.q-c.hk`.
- Deploy through the existing GitHub Pages workflow.

final result: passed

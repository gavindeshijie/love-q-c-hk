**Findings**
- No P0/P1/P2 issues remain for the current mobile landing screen.

**Source Visual Truth**
- `/tmp/codex-remote-attachments/019efd71-fb8e-7d91-8a28-6cbb372caad1/2906C960-B99D-4737-9CD0-D0C3672CFED9/1-照片-1.jpg`

**Implementation Evidence**
- Local URL: `http://127.0.0.1:8091/`
- Implementation screenshot: `/private/tmp/love-local-mobile-v12.png`
- Full-view comparison: `/private/tmp/love-comparison-v12.png`
- Focused card comparison: `/private/tmp/love-focus-cards-v12.png`
- Viewport: `427x640`, `deviceScaleFactor: 2`, mobile viewport.
- State: default page load, Chinese card selected.

**Required Fidelity Surfaces**
- Fonts and typography: heading, language labels, currencies, and price lines match the visual hierarchy and wrapping of the reference. The implementation uses browser-safe multilingual font fallbacks, so exact antialiasing can vary by device.
- Spacing and layout rhythm: six language cards, header block, and bottom feature strip align to the reference mobile composition. No visible text overflow or card overlap remains.
- Colors and visual tokens: dark violet/black neon palette, purple glows, white text, red flags, and floor lighting are consistent with the reference.
- Image quality and asset fidelity: the six flags are individual image assets cropped from the supplied visual instead of CSS approximations. The whole reference image is not used as a page background.
- Copy and content: all visible language labels, pricing labels, and service benefit text match the reference.

**Patches Made Since Previous QA Pass**
- Rebalanced the top header: smaller title text, higher text block, and restored spacing before the language grid.
- Reworked the language grid proportions: slightly narrower than the first build, shorter than the deployed v8 build, and better aligned to the reference's bottom feature strip.
- Enlarged the flag display while preserving the separate PNG flag assets.
- Reduced background dot brightness and side-city intensity so the cards dominate like the reference.
- Replaced the softer card outline with a thicker octagonal neon frame and added subtle segmented corner rails.
- Kept all visible language/card text as editable HTML text instead of baking it into the image.

**Follow-up Polish**
- P3: the background city/globe is still a code-built approximation, not the same photo-level detail as the source image. This is the largest remaining visual difference because the full original image is intentionally not used as the page background.

**Implementation Checklist**
- Use the current `public/index.html`.
- Include `public/assets/flag-china.png`, `flag-singapore.png`, `flag-thailand.png`, `flag-vietnam.png`, `flag-malaysia.png`, and `flag-laos.png`.
- Keep `public/CNAME` as `love.q-c.hk`.
- Deploy through the existing GitHub Pages workflow.

final result: passed

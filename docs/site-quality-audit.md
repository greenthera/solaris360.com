# Styling, images and SEO review — 23 October 2026

Reviewed the local production build, preserving the existing design, animations, illustrations, calculator behavior and uncommitted work. No deployment, commit or push was performed.

## Changes

- Added intrinsic image dimensions from the existing asset metadata to shared page heroes, media rows, panoramic bands and gallery thumbnails. Container crops remain unchanged.
- Added responsive WebP fallback sources to the footer image, alongside its existing AVIF sources.
- Applied a light native-control color scheme inside light calculator sections; the surrounding site retains its dark theme.
- Made the FAQ, reviews, useful-links and EPC-service search titles more descriptive.
- Added Twitter social-image alt metadata alongside the existing Open Graph alt text.
- Escaped `<` in serialized JSON-LD so content cannot terminate its script element.
- Removed the business's own review/rating JSON-LD from the Reviews page. Visible reviews, rating figures and Google links remain unchanged. Google does not support self-serving review snippets for a LocalBusiness or Organization, including reviews imported from another site: [review snippet guidelines](https://developers.google.com/search/docs/appearance/structured-data/review-snippet).
- Added a static redirect from the previous `/roi-calculater/` spelling to `/roi-calculator/`, excluded from the sitemap.
- Added `npm run check:seo` to validate generated HTML and static assets after a build. It checks unique titles/descriptions, canonical and Open Graph URLs, social images/alt metadata, JSON-LD presence/parsing, breadcrumbs, calculator schema, image and picture sources, internal links, sitemap coverage, robots and noindex on the 404 page. It uses Node built-ins and does not contact the live site.
- Updated the calculator browser test for the current root deployment path and the intentionally hidden Share button. Incoming shared links continue to be tested; the UI flag was not changed.

## Verification

- `npm run build`, `npm run lint`, `npm test` (19 tests), and `npm run check:seo` pass.
- All 21 indexable pages checked in Chromium at 1440px and 390px: one main heading per page, loaded images, no broken local asset requests, no page-wide horizontal overflow and no JavaScript exceptions.
- Social-image files exist for all indexable pages. Titles, descriptions and canonical URLs are unique. The sitemap covers all generated indexable pages and excludes redirects and the 404 page.
- Checked key desktop/mobile screenshots. Images retain their intended crops; overflowing calculator tables/charts stay inside scrollable containers. Wide marquee tracks remain intentionally clipped.
- Checked mobile menu navigation, client-side title/canonical updates, gallery filters and lightbox navigation, FAQ expansion, the legacy ROI redirect and the noindex 404 page.
- Calculator browser regression checks pass, including validation, live results, tooltips, incoming links, four viewport widths and ROI/EMI report downloads. Google Form test requests are intercepted; no live leads are submitted.
- Normal-motion and reduced-motion homepage behavior checked without altering the animation code.

## Scope and follow-up

These checks validate local build output and browser behavior, not Google indexing or real-user Core Web Vitals. Validate the deployed domain's redirects, HTTP statuses, Search Console coverage and rich-result eligibility after deployment. DNS/custom-domain configuration was not changed. No verification tokens or unsupported rating markup were added.

Additional primary guidance used during review: [canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [image SEO](https://developers.google.com/search/docs/appearance/google-images), and [structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

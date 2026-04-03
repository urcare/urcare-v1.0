# UrCare — LandingDiabetes Shopify export

This exports `src/pages/LandingDiabetes.tsx` **as-is** into a Shopify Online Store 2.0 theme using a single JS + CSS bundle.

## Build the Shopify bundle

From the repo root:

```bash
npm install
npm run build:shopify:landing-diabetes
```

This writes:
- `shopify-export/landing-diabetes/theme/assets/urcare-landing-diabetes.js`
- `shopify-export/landing-diabetes/theme/assets/urcare-landing-diabetes.css`

## Copy files into your Shopify theme

Copy these folders/files into your Shopify theme code:
- `shopify-export/landing-diabetes/theme/sections/urcare-landing-diabetes.liquid`
- `shopify-export/landing-diabetes/theme/templates/page.urcare-landing-diabetes.json`
- `shopify-export/landing-diabetes/theme/layout/urcare-landing-diabetes.liquid`
- `shopify-export/landing-diabetes/theme/assets/urcare-landing-diabetes.js`
- `shopify-export/landing-diabetes/theme/assets/urcare-landing-diabetes.css`

## Upload required images (IMPORTANT)

`LandingDiabetes.tsx` references these paths, and the section maps them to Shopify theme assets:

- `brand.png`
- `hh.JPG`
- `IMG_8141.JPG`
- `IMG_9404.JPG`
- `IMG_9696.JPG`
- `IMG_9439.JPG`
- `Pancrereviv.JPG`
- `Glucolow.JPG`
- `Alice.JPG`
- `Arjun.JPG`
- `Himani.JPG`
- `Jacob.JPG`
- `Jamie.JPG`
- `Kajal.JPG`
- `Mukesh.JPG`
- `Priyank.JPG`
- `Shreya.JPG`
- `Smriti.JPG`

Upload those image files into **theme** `assets/` with **exactly** these filenames.

## Create the Shopify page

In Shopify Admin:
- Online Store → Pages → Add page
- Theme template → pick **"page.urcare-landing-diabetes"**
- Save, then open the page URL

## Notes

- This uses a custom layout (`layout/urcare-landing-diabetes.liquid`) so the landing page styles don’t affect the rest of your store.
- If you rename any image files, update the mapping in `sections/urcare-landing-diabetes.liquid`.


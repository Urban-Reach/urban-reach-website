# Background image audit — DONE

> **Status: all four images have been generated, installed and verified.**
> Home keeps the original kitchen; About, Appliances, Process and Contact each
> have their own photograph. Every page now has a distinct background.
>
> This file is kept as the record of what each image is for and the prompt that
> made it, so any one of them can be regenerated later without starting from
> scratch. The originals live in your Downloads folder as `hero-about.png`,
> `hero-appliances.png`, `hero-process.png` and `hero-contact.png` — keep them.
>
> The audit and prompts below are unchanged from when they were written.

---

## Original audit — what was duplicated, and what to generate

## The audit result

I went through every page and every section looking for a background photograph.
There are exactly **five** of them, and they are all the **same photograph**:

| Where | File | What it actually is |
|---|---|---|
| Home hero | `public/hero/home.webp` | `moody kitchen.png`, full frame |
| About hero | `public/hero/about.webp` | `moody kitchen.png`, left third |
| Appliances hero | `public/hero/appliances.webp` | `moody kitchen.png`, centre |
| Process hero | `public/hero/process.webp` | `moody kitchen.png`, right of centre |
| Contact hero | `public/hero/contact.webp` | `moody kitchen.png`, far right |

One photograph, cropped five ways. Different regions of the room, so it isn't
literally the identical frame — but it is the same lighting, the same surfaces
and the same room, which is why it reads as repetition.

**Nothing else on the site uses a background photo.** Two things that might look
like it, and don't:

- The closing "Get in touch" band on every page is a drawn blueprint grid, not a
  photograph. No image needed.
- The five photos on About and Process (`public/photos/*`) are real content
  images sitting inside the page, not backgrounds — the schedule on the desk,
  the crated appliances, the range going in, the install, the shipment. Those
  are already genuinely distinct from each other. **Leave them alone.**

So: **Home keeps the current photograph**, and the other four heroes each need
their own. Below is what each one should be and the prompt to make it.

---

## How to use this

1. Paste a prompt into ChatGPT (or any image generator) and ask for a
   **landscape** image, **2000px wide or more**.
2. Save it into your **Downloads** folder with the **exact filename** listed.
3. Tell me, and I'll run one command that processes and installs all four.

The filenames matter — the build already looks for these exact names and will
use each one automatically the moment it exists. Until then the page keeps
falling back to the old crop, so you can do them one at a time.

---

## 1. About hero → save as `hero-about.png`

**Currently:** the range-and-hood corner of the same kitchen.

**What it should communicate:** who Urban Reach is on a project — the company
that shows up to an unfinished building. This is the one background that should
**not** be a finished kitchen at all, which is what separates it from every
other image on the site: raw construction instead of completed space.

**Prompt:**

> Photorealistic interior of an unfinished multifamily apartment building at
> dusk. Bare concrete floor, exposed metal stud framing, drywall partly hung.
> Several large appliance shipping crates and a shrink-wrapped pallet staged
> against one wall. Lit only by a single warm amber work light on a tripod, deep
> shadows, cool blue daylight falling through an unglazed window opening in the
> background. Dark, moody, cinematic, shot on a 35mm lens, shallow depth of
> field. No people, no text, no logos, no signage.

---

## 2. Appliances hero → save as `hero-appliances.png`

**Currently:** the stainless reach-in doors in the same kitchen.

**What it should communicate:** volume and product. This page is the catalogue,
so its background should be the equipment itself with **no room around it** —
that absence of architecture is what makes it different from all four others.
Repetition is the point: it should look like quantity, not like one kitchen.

**Prompt:**

> Photorealistic close-up of a long row of brand-new brushed stainless steel
> commercial refrigerator and oven fronts standing side by side in a dark
> warehouse aisle, receding into shadow with strong perspective. Protective
> plastic film still on some panels catching the light. Single warm amber
> overhead lamp raking across the metal, brushed grain and reflections clearly
> visible, everything else falling to near black. Dark, moody, cinematic,
> photorealistic, shallow depth of field. No room, no windows, no people, no
> text, no logos, no brand names.

---

## 3. Process hero → save as `hero-process.png`

**Currently:** the prep counters and window wall of the same kitchen.

**What it should communicate:** scheduling and delivery — the logistics half of
the business. It should be the only **exterior/night** image on the site, which
is what sets it apart: outdoors, after hours, everything on the move.

**Prompt:**

> Photorealistic loading dock at night. A white box truck backed up to the dock,
> roller door open, wooden pallets of crated appliances wrapped in plastic
> waiting under the lip. Wet concrete reflecting a single warm amber sodium lamp
> overhead, cool blue night beyond. Steam or light haze in the air. Dark, moody,
> cinematic, low camera angle, shot on a 35mm lens. No people, no text, no
> logos, no company names on the truck.

---

## 4. Contact hero → save as `hero-contact.png`

**Currently:** a tighter crop of the pass in the same kitchen.

**What it should communicate:** the finished result, and Austin. This is the
last page someone sees before writing to us, so it should be the warmest and
most complete of the set — and it should be a **residential-scale** kitchen at
blue hour with a city visible outside, which is what distinguishes it from the
commercial kitchen on the homepage.

**Prompt:**

> Photorealistic modern apartment kitchen at blue hour, just finished and empty.
> Stainless steel refrigerator and range newly installed in dark wood cabinetry,
> quartz countertop, protective film peeled back on one appliance edge. Warm
> amber under-cabinet light pooling on the counter as the only interior light
> source, deep shadows elsewhere. Floor-to-ceiling window filling the right side
> of the frame with a distant Texas city skyline at dusk, cool blue against the
> warm interior. Dark, moody, cinematic, photorealistic, 35mm lens. No people,
> no text, no logos, no brand names.

---

## 5. Home hero → no change

`moody kitchen.png` stays where it is. It's the strongest frame of the five and
it belongs on the page that has to make the first impression. Once the four
above are in place it will be the only page using it, so it stops reading as
a repeated backdrop and starts reading as the signature image.

---

## One thing to keep in mind when you generate these

Every hero has dark scrim layers and a warm gradient painted on top of it in the
browser, and the headline sits in the middle of the frame. So:

- **Darker is safer than brighter.** A bright image fights the text.
- **Keep the middle of the frame quiet.** Detail belongs at the edges; busy
  detail dead centre competes with the headline.
- **No text or logos anywhere in the image.** Generators like to invent brand
  names on appliances, and an invented manufacturer on this site would be a
  real problem. If one appears, regenerate rather than crop it out.

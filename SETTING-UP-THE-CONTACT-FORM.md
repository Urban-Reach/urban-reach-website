# Setting up the contact form

Written for someone with no technical background. Follow it top to bottom.
Nothing here can break the website — if a step goes wrong, you can redo it.

**Time needed:** about 15 minutes for Part 1. Part 2 needs someone who can log
in to wherever `urbanreachtx.com` is registered.

---

## What we are actually doing, in plain terms

The contact form on the website collects a name, email, message and any files
someone attaches. Something has to take that information and turn it into an
email that lands in your inbox.

Websites can't send email on their own. You need a service for it. We're using
one called **Resend**. It's free at the volume you'll be doing.

You'll do two things:

1. **Part 1** — Create a Resend account and get a password-like code called an
   "API key". This makes the form work.
2. **Part 2** — Prove to Resend that you own `urbanreachtx.com`, so emails
   arrive as from *you* rather than from a generic address. This matters for
   looking professional and for not landing in spam.

Part 1 makes the form work today. Part 2 should be done before the site goes
live publicly.

---

## Part 1 — Make the form work

### Step 1: Create the Resend account

1. Go to **https://resend.com**
2. Click **Sign up**.
3. **Important:** sign up using **info@urbanreachtx.com**.

   This matters. Until Part 2 is finished, Resend will only deliver mail to the
   exact address that owns the account. Signing up with `info@urbanreachtx.com`
   means form submissions reach you straight away. If you sign up with a Gmail
   address instead, submissions will go there until Part 2 is done.

4. Confirm your email address when Resend sends you a confirmation link.

### Step 2: Get your API key

An API key is a long password that lets the website talk to Resend. Treat it
like a password — don't email it around or paste it anywhere public.

1. Once logged in to Resend, find **API Keys** in the left-hand menu.
2. Click **Create API Key**.
3. Name it something like `Urban Reach website`.
4. For permission, choose **Sending access** (not full access).
5. Click **Add**.
6. Resend shows you the key **once**. It starts with `re_`.

   **Copy it now and paste it somewhere safe** — a password manager, or a note
   you'll be able to find. Once you close that box, Resend will never show it
   again. If you lose it, that's fine: just delete the key and make a new one.

### Step 3: Give the key to the website

There are two places this goes, depending on what you're doing.

#### If you are testing on your own computer

1. In the website project folder, find the file called **`.env.example`**.
2. Make a copy of it in the same folder and name the copy **`.env.local`**
   exactly (starting with a dot, no `.txt` on the end).
3. Open `.env.local` in TextEdit.
4. Find the line that says:

   ```
   RESEND_API_KEY=
   ```

5. Paste your key straight after the `=`, with no spaces. It should look like:

   ```
   RESEND_API_KEY=re_AbCdEf123456789
   ```

6. Find the line starting `CONTACT_FROM=` and, for now, set it to exactly this:

   ```
   CONTACT_FROM="Urban Reach Website <onboarding@resend.dev>"
   ```

   `onboarding@resend.dev` is a temporary address Resend provides so you can
   test before Part 2 is done. Part 2 replaces it with your own domain.

7. Save the file and close it.
8. Restart the website (stop it, then run `npm run dev` again). The form will
   now send.

#### If the site is already published on Vercel

1. Log in at **https://vercel.com** and open the Urban Reach project.
2. Click **Settings**, then **Environment Variables** in the side menu.
3. Add these one at a time. For each, type the name in the first box and the
   value in the second, leave all three environment checkboxes ticked, and
   click **Save**:

   | Name | Value |
   | --- | --- |
   | `RESEND_API_KEY` | your `re_...` key |
   | `CONTACT_FROM` | `Urban Reach Website <onboarding@resend.dev>` |
   | `CONTACT_TO` | `info@urbanreachtx.com` |

4. Go to the **Deployments** tab, find the most recent deployment, click the
   **⋯** menu on the right, and choose **Redeploy**.

   This step is easy to forget and nothing works without it. Environment
   variables only take effect on a fresh deployment.

### Step 4: Test it

1. Open the website and go to the Contact page.
2. Fill the form in as a customer would. Use a real message so you can
   recognise it.
3. Click **Send message**.
4. You should see a "Thank you — your message is in." panel.
5. Check the `info@urbanreachtx.com` inbox. **Check the spam folder too** —
   before Part 2, mail from `onboarding@resend.dev` often lands there.

**If you see an error instead**, see Troubleshooting at the bottom.

---

## Part 2 — Send from your own domain

Right now emails arrive from `onboarding@resend.dev`. That works, but it looks
like a stranger sent it and it's more likely to be filtered as spam. This part
fixes that.

This step requires adding a few records to your domain's DNS settings. DNS is
the address book of the internet. You need access to wherever
`urbanreachtx.com` is registered — that may be Wix, GoDaddy, Namecheap,
Squarespace or similar. If you don't know, find the company that bills you for
the domain each year.

**This is the one step worth handing to whoever manages your domain.** It's not
dangerous, but a typo means email silently doesn't arrive, and the records are
fiddly to read.

### Step 1: Add the domain in Resend

1. In Resend, click **Domains** in the left menu.
2. Click **Add Domain**.
3. Type `urbanreachtx.com` and click **Add**.
4. Resend now shows a table of records — usually three or four rows. Each row
   has a **Type** (like `TXT` or `MX`), a **Name**, and a **Value**.

   Leave this page open. You'll copy from it in the next step.

### Step 2: Add those records at your domain registrar

1. Log in to wherever `urbanreachtx.com` is registered.
2. Find the DNS settings. It's usually under a heading like "DNS", "DNS
   Records", "Advanced DNS", or "Manage DNS".
3. For each row in Resend's table, create a matching record. Copy and paste
   the values rather than typing them — a single wrong character stops it
   working.
4. Save.

Two things that trip people up:

- Some registrars automatically add your domain to the end of the Name field.
  If Resend says the name is `send` and your registrar shows the result as
  `send.urbanreachtx.com`, that's correct. If it shows
  `send.urbanreachtx.com.urbanreachtx.com`, remove the domain part.
- **Do not delete or change any existing records**, especially existing `MX`
  records, unless Resend explicitly tells you to replace one. Those may be
  carrying your current email.

### Step 3: Wait, then verify

1. Back in Resend, click **Verify** on the domain.
2. It may not verify immediately. DNS changes typically take 15 minutes to a
   few hours to spread. Occasionally up to 24 hours.
3. Once every row shows **Verified**, continue.

### Step 4: Switch the website to your domain

Change `CONTACT_FROM` from the temporary address to your own:

```
CONTACT_FROM="Urban Reach Website <website@urbanreachtx.com>"
```

You do **not** need to create a `website@` mailbox — this is a sending-only
address, and replies won't go to it. When you reply to a form submission, your
email program replies directly to the person who filled in the form, because
the site sets their address as the reply-to.

Change it in the same place you set it before:

- On your computer: edit `.env.local`, save, and restart the site.
- On Vercel: **Settings → Environment Variables**, edit `CONTACT_FROM`, save,
  then **Deployments → ⋯ → Redeploy**.

Then send yourself one more test message. It should now arrive from
`urbanreachtx.com` and land in the inbox rather than spam.

---

## Good to know

**What visitors can send.** Name, email, company, phone, project type, a
message, and up to 5 file attachments totalling 10 MB — so a general contractor
can attach an appliance schedule or plan sheets. Accepted file types are PDF,
Word, Excel, CSV, common image formats, DWG, DXF, RVT and ZIP.

**Replying.** Just hit reply. The form sets the sender's address as the
reply-to, so your reply goes to them, not to Resend.

**Spam protection.** The form has a hidden field that real people never see but
automated bots fill in. Anything that fills it is silently discarded. You will
not see those.

**Cost.** Resend's free tier covers 3,000 emails a month and 100 a day. A
contact form will not come close.

**If the form ever breaks**, visitors are not left stranded — they see a message
telling them to email `info@urbanreachtx.com` directly, with the address shown.

---

## Troubleshooting

**"Something went wrong sending your message."**
The API key or `CONTACT_FROM` is missing, mistyped, or the site wasn't restarted
or redeployed after you set them. Re-check Step 3, then restart or redeploy.

**Nothing arrives, but the form says thank you.**
Check spam first. Then check that you signed up for Resend with
`info@urbanreachtx.com`. Before Part 2 is complete, Resend only delivers to the
address that owns the account. You can also open **Logs** in Resend, which shows
every send attempt and whether it succeeded.

**Resend says the domain won't verify.**
Almost always a copy-paste error or a doubled domain name in the Name field.
Compare each record character by character against Resend's table. If it still
fails after a few hours, your registrar may have added its own domain suffix —
see the note in Part 2, Step 2.

**"This key is invalid."**
API keys are shown once. If you're not certain you copied it correctly, delete
it in Resend and create a new one — it costs nothing.

**Someone reports the form rejected their file.**
Either it's not an accepted type, or the attachments total more than 10 MB. They
can email it to `info@urbanreachtx.com` instead. If this happens often, the
limits can be raised.

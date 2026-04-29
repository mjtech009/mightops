# MightOps Portfolio Website

Static site ready for GitHub Pages. Contact form saves leads to CSV **and** emails you via SMTP — no backend, no paid APIs.

---

## 🚀 Deploy to GitHub Pages (5 minutes)

1. Create a new repo on GitHub (e.g. `mightops-site`)
2. Upload all files (index.html, css/, js/, README.md)
3. Go to **Settings → Pages → Source → Deploy from branch → main / root**
4. Your site is live at `https://yourusername.github.io/mightops-site/`

**Custom domain (mightops.com):**
- In GitHub Pages settings, enter `mightops.com` under "Custom domain"
- At your domain registrar (GoDaddy/Namecheap/etc.), add these DNS records:
  ```
  A     @    185.199.108.153
  A     @    185.199.109.153
  A     @    185.199.110.153
  A     @    185.199.111.153
  CNAME www  yourusername.github.io
  ```
- Wait up to 24 hours for DNS propagation

---

## 📧 Setup EmailJS (Free SMTP — no backend needed)

EmailJS sends emails directly from the browser using your SMTP details. Free plan = 200 emails/month.

### Step 1 — Create account
Go to [https://www.emailjs.com](https://www.emailjs.com) → Sign Up (free)

### Step 2 — Add your SMTP service
1. Dashboard → **Email Services** → **Add New Service**
2. Choose **"SMTP"** (or Gmail/Outlook if you prefer)
3. Enter your SMTP details:
   ```
   SMTP Server:  your SMTP host (e.g. smtp.yourdomain.com)
   Port:         587 (TLS) or 465 (SSL)
   Username:     info@mightops.com
   Password:     your SMTP password
   From Email:   info@mightops.com
   From Name:    MightOps
   ```
4. Click **Connect Service** → note the **Service ID** (e.g. `service_abc123`)

### Step 3 — Create email template
1. Dashboard → **Email Templates** → **Create New Template**
2. Use this template:

   **Subject:** New enquiry from {{from_name}} — MightOps

   **Body:**
   ```
   New contact form submission from mightops.com

   Name:     {{from_name}}
   Email:    {{from_email}}
   Phone:    {{phone}}
   Company:  {{company}}
   Interest: {{interest}}

   Message:
   {{message}}

   ---
   Reply directly to: {{reply_to}}
   ```

3. Set **To Email** = `info@mightops.com`
4. Save → note the **Template ID** (e.g. `template_xyz789`)

### Step 4 — Get your Public Key
1. Dashboard → **Account** → **API Keys**
2. Copy your **Public Key** (e.g. `user_XXXXXXXXXXXX`)

### Step 5 — Update js/main.js
Open `js/main.js` and replace the three config values at the top:

```javascript
const EMAILJS_PUBLIC_KEY  = 'user_XXXXXXXXXXXX';   // ← your Public Key
const EMAILJS_SERVICE_ID  = 'service_abc123';       // ← your Service ID
const EMAILJS_TEMPLATE_ID = 'template_xyz789';      // ← your Template ID
```

Commit and push → done! Every form submission now:
- ✅ Sends an email to info@mightops.com
- ✅ Saves the lead locally (downloadable as CSV)

---

## 📊 Download Leads as CSV

Every form submission is saved in the visitor's browser (localStorage).  
To download all leads:
1. Open the site
2. Scroll to the Contact section
3. Click **"⬇ Download Leads CSV"**

The CSV includes: name, email, phone, company, interest, message, timestamp.

> **Tip:** For persistent cross-device lead storage (so all leads are in one place regardless of which browser submitted), consider adding a free [Airtable](https://airtable.com) form integration or [Formspree](https://formspree.io) as a backup endpoint alongside EmailJS.

---

## 🎨 Customising Content

| What to change | Where |
|---|---|
| Your name / company details | `index.html` |
| Stats (120+ clients, $40M etc.) | `index.html` → `.stats-bar` |
| Skills / services | `index.html` → `#skills` section |
| Case studies / projects | `index.html` → `#projects` section |
| Blog posts | `index.html` → `#blog` section |
| Consultant name/email | `index.html` → `.consultant` section |
| Colours / fonts | `css/style.css` → `:root` variables |

---

## 📁 File Structure

```
mightops/
├── index.html          ← Main portfolio page
├── css/
│   └── style.css       ← All styles
├── js/
│   └── main.js         ← EmailJS + CSV + interactions
└── README.md           ← This file
```

---

## 🆓 Free Services Used

| Service | Purpose | Free Tier |
|---|---|---|
| GitHub Pages | Hosting | Unlimited |
| EmailJS | SMTP email delivery | 200 emails/month |
| Google Fonts | Syne + DM Sans fonts | Unlimited |
| PapaParse (CDN) | CSV generation | Unlimited |

---

*Built for MightOps — mightops.com*

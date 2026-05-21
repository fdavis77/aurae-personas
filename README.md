# Aurae Personas

**Creator brand identity as a Markdown skill file for Claude.**

Drop a persona into Claude Code and every generation — UI, copy, captions, landing pages, campaigns — comes out in that creator's exact aesthetic. Not a template. A full design intelligence built from how they actually show up online.

---

## What it looks like

```markdown
---
name: '@noirmode-persona'
description: Design persona for @noirmode. Use when generating brand assets,
  UI, copy, or campaigns in their aesthetic.
metadata:
  energy: editorial
  niche: archive fashion anti-trend
---

## Energy Signature
A deliberate silence in a screaming wardrobe — dressed with conviction, not permission.

## Visual Palette
- Primary:  #1C1C1A
- Accent:   #8C7B6B
- Surface:  #F0EDE8
- Mood: worn monochrome — the colour of old photographs and considered restraint

## Typography
- Headlines: Canela
- Body:      Founders Grotesk
- Pairing principle: Serif with editorial weight anchors the archive sensibility;
  grotesque body keeps it unsentimental and clean

## Design Principles
1. Restraint is the statement: negative space and silence carry as much weight as any image
2. Longevity over legibility — design for the person who reads twice
3. Proportion governs everything: in clothing, in layout, in the ratio of words to white space
```

That's the whole thing. A `.md` file. No app. No login. No dashboard.

---

## Quick start

**1. Clone the repo**
```bash
git clone https://github.com/fdavis77/aurae-personas
cd aurae-personas
```

**2. Install a persona into Claude Code**
```bash
cp personas/@noirmode-persona.md ~/.claude/skills/
```

**3. Use it**

Open Claude Code and invoke the skill, then ask for anything:
```
/noirmode-persona

Design a product page for a new unisex fragrance brand.
```

Claude now knows the palette, typography, tone, photography style, and design principles — and applies them without you having to explain anything.

---

## The three personas included

### [@fabdavis](./personas/%40fabdavis-persona.md) — fitness · personal brand · `driven`
> *Disciplined by design — where dark mornings, clean spaces, and relentless consistency forge both body and brand.*

- Palette: near-black `#0D0D0D` + electric yellow-green `#C8FF00`
- Type: Bebas Neue + Inter
- Motion: hard cuts, moderate pace
- Captions: bold hook → truth → call to action

---

### [@lumina.away](./personas/%40lumina.away-persona.md) — slow travel · film photography · `calm`
> *The quiet pursuit of light in places the algorithm hasn't found yet.*

- Palette: warm sand `#C4A882` + deep earth `#7A5C3E`
- Type: Cormorant Garamond + Freight Text (all serif)
- Motion: smooth dissolves, slow pace
- Captions: one precise observation, no CTA — the thought is complete

---

### [@noirmode](./personas/%40noirmode-persona.md) — archive fashion · anti-trend · `editorial`
> *A deliberate silence in a screaming wardrobe — dressed with conviction, not permission.*

- Palette: near-black `#1C1C1A` + warm taupe `#8C7B6B`
- Type: Canela + Founders Grotesk
- Motion: smooth dissolves, slow pace
- Captions: single provocation — no hashtags, no call to action

---

## What each persona contains

| Section | What it gives Claude |
|---|---|
| **Energy Signature** | One sentence that defines the entire brand feeling |
| **Visual Palette** | Five-colour system with a mood descriptor |
| **Typography** | Headline + body pairing with the reasoning behind it |
| **Photography Style** | 4–5 directives for how images should look and feel |
| **Content Personality** | Tone, caption structure, vocabulary to use and avoid |
| **Performance Signals** | Which content formats over-index and on which metrics |
| **Motion Signature** | Pace, cut style, and principle for video and animation |
| **Design Principles** | Three rules that govern every creative decision |

---

## Generate your own

You'll need an [Anthropic API key](https://console.anthropic.com) and Node.js 18+.

```bash
# Add your API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# Install dependencies
npm install

# Generate from a built-in example profile
node scripts/generate-persona.js --persona fitness
node scripts/generate-persona.js --persona travel
node scripts/generate-persona.js --persona fashion
```

To generate from your own Instagram data, pass a JSON file:

```bash
node scripts/generate-persona.js --data ./my-profile.json
```

The JSON shape:

```json
{
  "profile": {
    "username": "yourhandle",
    "biography": "Your bio here",
    "followersCount": 12000
  },
  "posts": [
    {
      "caption": "Post caption here",
      "likeCount": 843,
      "commentsCount": 62,
      "mediaType": "IMAGE"
    }
  ]
}
```

Output is written to `personas/@yourhandle-persona.md` and is ready to install as a Claude Code skill immediately.

---

## How the generation works

1. Your Instagram profile and post captions are sent to Claude (`claude-sonnet-4-6`)
2. Claude analyses content signals: what performs, what's consistent, what vocabulary recurs, what visual patterns emerge
3. The result is structured into the persona format and written as a Markdown file
4. No data is stored anywhere — the file lives on your machine

The analysis takes about 10–15 seconds.

---

## Use cases

- **Creators** — generate your own persona and use it to brief any AI tool on your brand
- **Designers** — use an existing persona as a creative brief when working with a creator client
- **Agencies** — build a persona library for every client, version it in Git
- **Developers** — use the persona as a system prompt when building creator-facing tools

---

## Why Markdown

A persona file works in Claude Code, Claude.ai, the Anthropic API, and any other AI tool that accepts text context. It can be versioned in Git, forked, edited by hand, and shared as a single file attachment. It doesn't require a running server, a database, or a subscription.

The file *is* the product.

---

## Coming next

- Persona packs by niche (food, finance, music, gaming)
- Claude Code plugin for one-command install from this repo
- Team mode — manage personas for multiple creator clients
- Persona diff — compare two creators' aesthetics side by side

---

## Contributing

Contributions welcome. If you generate a persona you're proud of and want to add it to the examples, open a PR. Keep the handle in the filename, include the niche in the PR description.

---

Built by [Axom AI](https://axom.ai) · Powered by [Claude](https://anthropic.com)

# Aurae Personas

Creator brand identity as a Markdown file.

Drop one into Claude Code and every generation — UI, copy, captions, campaigns — comes out in that creator's aesthetic. Not a template. A full design intelligence derived from how they actually show up online.

---

## What's in a persona file

Each `.md` file is a Claude Code skill containing:

| Section | What it defines |
|---|---|
| **Energy Signature** | One sentence that captures the creator's entire brand feeling |
| **Visual Palette** | Six-colour system with mood descriptor |
| **Typography** | Headline + body pairing with the principle behind it |
| **Photography Style** | 4–5 directives for how images should feel |
| **Content Personality** | Tone, caption structure, vocabulary to use and avoid |
| **Performance Signals** | Which content types over-index and on which metrics |
| **Motion Signature** | Pace, style, and principle for video and animation |
| **Design Principles** | Three rules that govern every creative decision |

---

## Example personas

### [@fabdavis](./personas/\@fabdavis-persona.md) — fitness · personal brand
> *Discipline made visible — where the weight room meets the feed and every rep is a statement of intent.*

`driven` · high-contrast monochrome · Space Grotesk + Inter · hard cuts

---

### [@lumina.away](./personas/%40lumina.away-persona.md) — slow travel · film photography
> *The quiet pursuit of light in places the algorithm hasn't found yet.*

`calm` · warm grain · Cormorant Garamond + Freight Text · smooth dissolves

---

### [@noirmode](./personas/\@noirmode-persona.md) — archive fashion · anti-trend
> *A deliberate silence in a screaming wardrobe — dressed with conviction, not permission.*

`editorial` · worn monochrome · Canela + Founders Grotesk · smooth dissolves

---

## How to use

### In Claude Code

1. Copy a `.md` file to your Claude skills directory:
   ```bash
   cp @fabdavis-persona.md ~/.claude/skills/
   ```

2. In any Claude Code session, invoke the skill:
   ```
   /fabdavis-persona
   ```

3. Now ask Claude to generate anything — UI, captions, a brand kit — and it works in that creator's aesthetic.

**Example:**
```
/fabdavis-persona

Design a landing page hero section for a new fitness app.
```

Claude will use the persona's palette, typography, tone, and design principles automatically.

### In Claude.ai or the API

Paste the file contents directly into your system prompt. The frontmatter and sections give Claude everything it needs.

---

## Generate your own

You need:
- An `ANTHROPIC_API_KEY` in `.env.local`
- Node.js 18+

```bash
# Clone this repo
git clone https://github.com/your-org/aurae-personas
cd aurae-personas

# Generate from a built-in mock
node scripts/generate-persona.js --persona fitness
node scripts/generate-persona.js --persona travel
node scripts/generate-persona.js --persona fashion

# Generate from your own Instagram data
node scripts/generate-persona.js --data ./my-instagram-export.json
```

The `--data` flag accepts a JSON file with this shape:
```json
{
  "profile": {
    "username": "yourhandle",
    "biography": "Your bio here",
    "followersCount": 12000
  },
  "posts": [
    { "caption": "Post caption", "likeCount": 843, "mediaType": "IMAGE" }
  ]
}
```

Output is written to `personas/@yourhandle-persona.md`.

---

## The idea

Markdown is the right format for brand intelligence.

It's readable by humans and by AI. It can be versioned in Git. It can be sold, shared, or forked. It doesn't require a login, a subscription, or a dashboard — it's just a file that knows who you are.

Every persona is generated fresh from Claude's analysis of real content signals: what performs, what's consistent, what's being said and how. The result is a design system that actually reflects how a creator shows up, not a generic template that could belong to anyone.

---

## Coming soon

- Persona packs by niche (fitness, travel, fashion, food, finance)
- Claude Code plugin for one-command install
- Team personas (for agencies managing multiple creator clients)
- Persona diff — compare two creators' aesthetics side by side

---

Built by [Axom AI](https://axom.ai) · Powered by Claude

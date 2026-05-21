#!/usr/bin/env node
/**
 * Aurae Persona Generator
 * Analyses Instagram data with Claude and writes a .md skill file.
 *
 * Usage:
 *   node scripts/generate-persona.js --persona fitness
 *   node scripts/generate-persona.js --persona travel
 *   node scripts/generate-persona.js --persona fashion
 *   node scripts/generate-persona.js --data ./my-posts.json
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Anthropic from '@anthropic-ai/sdk'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Load .env.local manually
const envPath = path.join(ROOT, '.env.local')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...rest] = line.split('=')
    if (k && rest.length && !process.env[k.trim()]) {
      process.env[k.trim()] = rest.join('=').trim()
    }
  })
}

// ── Mock datasets ────────────────────────────────────────────────────────────

const MOCKS = {
  fitness: {
    profile: {
      username: 'fabdavis',
      name: 'Fab Davis',
      biography: 'Creator. Building in public. Fitness, mindset & tech.',
      followersCount: 12400,
      mediaCount: 187,
    },
    posts: [
      { caption: 'Morning routine hits different when you actually stick to it. Dark room, black coffee, no distractions. This is how you build.', likeCount: 843, commentsCount: 62, mediaType: 'IMAGE' },
      { caption: 'The aesthetic you build online is an extension of who you are offline. Make it intentional.', likeCount: 1204, commentsCount: 94, mediaType: 'IMAGE' },
      { caption: '3 things I wish I knew before building my personal brand. Save this.', likeCount: 2100, commentsCount: 187, mediaType: 'VIDEO' },
      { caption: 'Black, clean lines, minimal clutter. Your environment shapes your output.', likeCount: 967, commentsCount: 45, mediaType: 'IMAGE' },
      { caption: 'Consistency over intensity. Every single time.', likeCount: 1560, commentsCount: 103, mediaType: 'IMAGE' },
      { caption: 'How I turned my morning workout into content without it feeling forced.', likeCount: 3200, commentsCount: 241, mediaType: 'CAROUSEL_ALBUM' },
      { caption: 'The gym at 5am is a different world. Just you and the iron.', likeCount: 789, commentsCount: 38, mediaType: 'IMAGE' },
      { caption: 'Stop waiting for perfect. Start with what you have. Build as you go.', likeCount: 2340, commentsCount: 178, mediaType: 'IMAGE' },
    ],
  },

  travel: {
    profile: {
      username: 'lumina.away',
      name: 'Lumina',
      biography: 'Slow travel. Film photography. Finding the light wherever I go.',
      followersCount: 89200,
      mediaCount: 412,
    },
    posts: [
      { caption: 'There is a specific quality of afternoon light in Lisbon that I have been chasing for three years. Found it on a Tuesday.', likeCount: 4200, commentsCount: 312, mediaType: 'IMAGE' },
      { caption: 'The slower you move the more you see.', likeCount: 6100, commentsCount: 487, mediaType: 'IMAGE' },
      { caption: 'Stayed in a village with no WiFi for 11 days. Would do it again immediately.', likeCount: 8700, commentsCount: 923, mediaType: 'CAROUSEL_ALBUM' },
      { caption: 'Film photography taught me patience. Travel taught me surrender. Both are the same lesson.', likeCount: 5500, commentsCount: 441, mediaType: 'IMAGE' },
      { caption: 'What a 6am train to nowhere looks like.', likeCount: 3900, commentsCount: 267, mediaType: 'IMAGE' },
      { caption: 'The colours here are not edited. Morocco just looks like this.', likeCount: 12400, commentsCount: 1104, mediaType: 'IMAGE' },
      { caption: 'Learning to sit in a café for two hours without looking at my phone. It is harder than it sounds.', likeCount: 7200, commentsCount: 688, mediaType: 'IMAGE' },
      { caption: 'Packing list: one bag, one camera, no expectations.', likeCount: 5800, commentsCount: 392, mediaType: 'CAROUSEL_ALBUM' },
    ],
  },

  fashion: {
    profile: {
      username: 'noirmode',
      name: 'Noir',
      biography: 'Styling as language. Archive pieces. The anti-trend.',
      followersCount: 34600,
      mediaCount: 298,
    },
    posts: [
      { caption: 'Dressing for the person you want to be, not the algorithm you want to feed.', likeCount: 2800, commentsCount: 234, mediaType: 'IMAGE' },
      { caption: 'This coat is from 1987. It has outlasted every trend it has watched come and go.', likeCount: 4100, commentsCount: 387, mediaType: 'IMAGE' },
      { caption: 'The most radical thing you can do right now is buy less.', likeCount: 6700, commentsCount: 891, mediaType: 'IMAGE' },
      { caption: 'Monochrome because colour is a distraction from silhouette.', likeCount: 3200, commentsCount: 198, mediaType: 'IMAGE' },
      { caption: 'Archive Margiela. Thrifted trench. Shoes from a market in Paris. Total: £43.', likeCount: 9800, commentsCount: 1204, mediaType: 'CAROUSEL_ALBUM' },
      { caption: 'Getting dressed is the first creative decision of your day. Treat it accordingly.', likeCount: 5100, commentsCount: 447, mediaType: 'IMAGE' },
      { caption: 'No logo. No print. No trend. Just proportion.', likeCount: 4400, commentsCount: 362, mediaType: 'IMAGE' },
      { caption: 'Found this Issey Miyake at a charity shop. The universe rewards patience.', likeCount: 7300, commentsCount: 823, mediaType: 'IMAGE' },
    ],
  },
}

// ── Claude analysis ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Aurae, a brand intelligence engine.
Analyse the Instagram profile and posts provided and return a JSON object with this exact shape:
{
  "energyType": one of driven|calm|editorial|playful|raw|luxury|bold|soft,
  "niche": string (2-5 words),
  "energySignature": string (one evocative sentence),
  "visualPalette": { "primary": hex, "accent": hex, "surface": hex, "text": hex, "mood": string },
  "typography": { "headlines": font name, "body": font name, "pairingPrinciple": string },
  "photographyStyle": [3-5 strings],
  "contentPersonality": { "tone": string, "captionStructure": string, "vocabulary": [4-6 words], "avoids": [3-5 words] },
  "performanceSignals": [{ "contentType": string, "metric": saves|comments|shares|likes, "multiplier": number }],
  "motionSignature": { "speed": fast|moderate|slow, "style": one of "hard cuts"|"smooth dissolves"|"bouncy"|"mechanical"|"organic", "principle": string },
  "designPrinciples": [3 strings]
}
Return ONLY the JSON. No markdown, no explanation.`

async function analyseWithClaude(profileData) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const prompt = `Profile: @${profileData.profile.username} — ${profileData.profile.biography}
Followers: ${profileData.profile.followersCount}
Posts analysed: ${profileData.posts.length}

Top posts (caption | likes | type):
${profileData.posts.map(p => `- "${p.caption}" | ${p.likeCount} likes | ${p.mediaType}`).join('\n')}`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''
  const text = raw.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
  return JSON.parse(text)
}

// ── Skill file writer ─────────────────────────────────────────────────────────

function buildSkillFile(handle, analysis) {
  const today = new Date().toISOString().split('T')[0]

  const frontmatter = {
    name: `@${handle}-persona`,
    description: `Design persona for @${handle}. Use when generating brand assets, UI, copy, or campaigns in their aesthetic.`,
    metadata: {
      type: 'persona',
      instagram: `@${handle}`,
      analysed: today,
      energy: analysis.energyType,
      niche: analysis.niche,
    },
  }

  const p = analysis

  const body = [
    `## Energy Signature\n${p.energySignature}`,
    `## Visual Palette\n- Primary:  ${p.visualPalette.primary}\n- Accent:   ${p.visualPalette.accent}\n- Surface:  ${p.visualPalette.surface}\n- Text:     ${p.visualPalette.text}\n- Mood: ${p.visualPalette.mood}`,
    `## Typography\n- Headlines: ${p.typography.headlines}\n- Body:      ${p.typography.body}\n- Pairing principle: ${p.typography.pairingPrinciple}`,
    `## Photography Style\n${p.photographyStyle.map(s => `- ${s}`).join('\n')}`,
    `## Content Personality\n- Tone: ${p.contentPersonality.tone}\n- Captions: ${p.contentPersonality.captionStructure}\n- Vocabulary: ${p.contentPersonality.vocabulary.join(', ')}\n- Avoids: ${p.contentPersonality.avoids.join(', ')}`,
    `## Performance Signals\n${p.performanceSignals.map(s => `- ${s.contentType}: ${s.multiplier}× average ${s.metric}`).join('\n')}`,
    `## Motion Signature\n- Speed: ${p.motionSignature.speed}\n- Style: ${p.motionSignature.style}\n- Principle: ${p.motionSignature.principle}`,
    `## Design Principles\n${p.designPrinciples.map((d, i) => `${i + 1}. ${d}`).join('\n')}`,
  ].join('\n\n')

  return matter.stringify(body, frontmatter)
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const personaFlag = args.indexOf('--persona')
  const dataFlag = args.indexOf('--data')

  let profileData
  let handle

  if (dataFlag !== -1) {
    const filePath = args[dataFlag + 1]
    if (!filePath) { console.error('--data requires a file path'); process.exit(1) }
    profileData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    handle = profileData.profile.username
  } else if (personaFlag !== -1) {
    const key = args[personaFlag + 1]
    if (!MOCKS[key]) { console.error(`Unknown persona "${key}". Options: ${Object.keys(MOCKS).join(', ')}`); process.exit(1) }
    profileData = MOCKS[key]
    handle = profileData.profile.username
  } else {
    console.error('Usage: node scripts/generate-persona.js --persona <fitness|travel|fashion>')
    console.error('       node scripts/generate-persona.js --data <path-to-json>')
    process.exit(1)
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set. Add it to .env.local')
    process.exit(1)
  }

  console.log(`Analysing @${handle} with Claude...`)
  const analysis = await analyseWithClaude(profileData)
  console.log(`Energy: ${analysis.energyType} | Niche: ${analysis.niche}`)

  const markdown = buildSkillFile(handle, analysis)

  const outDir = path.join(ROOT, 'personas')
  fs.mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, `@${handle}-persona.md`)
  fs.writeFileSync(outPath, markdown)

  console.log(`Written to personas/@${handle}-persona.md`)
}

main().catch(err => { console.error(err.message); process.exit(1) })

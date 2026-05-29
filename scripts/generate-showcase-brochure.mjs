import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
} from 'docx'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'docs')
const base = 'Uvend-Wallet-Showcase-Brochure'
const docxPath = path.join(outDir, `${base}.docx`)

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 160 },
    alignment: opts.align,
    children: [new TextRun({ text, size: opts.size ?? 22 })],
  })
}

function lead(text) {
  return new Paragraph({
    spacing: { after: 200 },
    children: [
      new TextRun({
        text,
        size: 24,
        italics: true,
        color: '2B4A6F',
      }),
    ],
  })
}

function bullet(text) {
  return new Paragraph({
    spacing: { after: 100 },
    bullet: { level: 0 },
    children: [new TextRun({ text, size: 22 })],
  })
}

function numbered(text) {
  return new Paragraph({
    spacing: { after: 120 },
    numbering: { reference: 'showcase-bullets', level: 0 },
    children: [new TextRun({ text, size: 22 })],
  })
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'showcase-bullets',
        levels: [
          {
            level: 0,
            format: 'decimal',
            text: '%1.',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: { indent: { left: 360, hanging: 260 } },
              run: { font: 'Calibri', bold: false },
            },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {},
      children: [
        new Paragraph({ spacing: { after: 400 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: 'Uvend Wallet',
              bold: true,
              size: 56,
              color: '1E40AF',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 320 },
          children: [
            new TextRun({
              text: 'Customer self-service for prepaid utilities',
              size: 28,
              color: '334155',
            }),
          ],
        }),
        lead(
          'A showcase-ready brochure: how end users experience prepaid electricity and water vending when you pair Uvend with a modern, branded wallet.'
        ),
        new Paragraph({
          text: 'The opportunity',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 120, after: 140 },
        }),
        p(
          'Prepaid consumers expect the same clarity they get from banking and retail apps. Uvend Wallet gives them one calm, branded place to manage meters, add funds, buy tokens, and see where money went—so your teams field fewer repetitive enquiries and your service feels intentional, not improvised.'
        ),
        new Paragraph({
          text: 'Built for utilities and vending partners',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 120, after: 140 },
        }),
        bullet(
          'Meter onboarding with validation so funding stays tied to genuine Uvend meters.'
        ),
        bullet(
          'Regional payment journeys your customers already trust—including mobile-money style top-ups (e.g. M-Pesa prompts familiar to East African users).'
        ),
        bullet(
          'Clear separation between wallet funding and token purchases—fewer “where did my money go?” moments.'
        ),
        new Paragraph({
          children: [new PageBreak()],
        }),
        new Paragraph({
          text: 'What customers experience',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 140 },
        }),
        numbered(
          'Overview — Balance at a glance, simple performance indicators, and recent activity on a single dashboard.'
        ),
        numbered(
          'Buy & meters — Register electricity and water meters, filter by utility, and purchase tokens without leaving the flow.'
        ),
        numbered(
          'Payments — Funding history and deposit summaries so “top-ups” are easy to audit.'
        ),
        numbered(
          'Profile — Communication preferences, personal details, and VAT-ready fields where your market requires them.'
        ),
        new Paragraph({
          text: 'Why it shines in client demos',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 140 },
        }),
        bullet(
          'Polished visual language—gradients, cards, and motion cues that read as consumer-grade, not an internal admin tool.'
        ),
        bullet(
          'Responsive by design: sidebar navigation on large screens; thumb-friendly bottom navigation on phones.'
        ),
        bullet(
          'Installable progressive web app (PWA)—Uvend Wallet can sit on the home screen like a native app.'
        ),
        new Paragraph({
          spacing: { before: 280, after: 120 },
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: 'Suggested demo storyline',
              bold: true,
              size: 24,
            }),
          ],
        }),
        p(
          'Sign in → add or validate a meter → top up the wallet → purchase a token → walk through history and summaries—in minutes, on laptop or handset.',
          { align: AlignmentType.CENTER, after: 320 }
        ),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          children: [
            new TextRun({
              text: 'Uvend',
              bold: true,
              size: 28,
              color: '1E40AF',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: 'Prepaid vending, made approachable.',
              italics: true,
              size: 22,
              color: '64748B',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 240 },
          children: [
            new TextRun({
              text: 'This collateral describes capabilities demonstrated in the Uvend Wallet reference experience.',
              size: 18,
              color: '94A3B8',
              italics: true,
            }),
          ],
        }),
      ],
    },
  ],
})

fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(docxPath, await Packer.toBuffer(doc))
console.log('Wrote', docxPath)

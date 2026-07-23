# Publishing a translation — checklist

A translation is not published when it renders. It is published when its
**licence conditions are satisfied** — and two of those conditions live
outside the content model entirely (`content-model.md` §9).

Work top to bottom. Do not consider the work done with anything unchecked.

## 0. Whose terms apply?

**Do this first, every time.** The standing grant that covers most of this
collection is *Kent C. Dodds's, for his posts*. It says nothing about any
other author.

- **KCD article** → the grant applies; go to §1.
- **Any other author** → there is no permission until you have one. Get it
  in writing, record it in `rights` (`basis`, `url`, `consultedAt`), and do
  not publish before it exists.

`rights.consultedAt` matters because a grant published in a repo can be
edited or withdrawn — record when you actually read it.

## 1. The three grant conditions (from the upstream CONTRIBUTING.md)

1. **Publish on your own site.** `/he/writing/[id]/` satisfies this. Do not
   offer the translation upstream — he explicitly does not manage
   translations in his repository.
2. **Open a PR on his repo** adding this translation to the post's
   `translations:` frontmatter: language, link, translator name, translator
   link. **See §2 — this is the one that gets skipped.**
3. **Begin the translation by stating it is a translation and linking the
   original.** Not a style preference: the permission rests on it.

## 2. The back-link PR

**Open the PR in the same work session that publishes the translation.** Not
after, not "next time I'm in that repo." Nothing mechanical catches this —
this checklist is the only mechanism, and it only works if you run it.
Record the PR URL in the publishing commit/PR description.

If a translation ever ships without its back-link PR, say so rather than
quietly fixing it — that near-miss is the evidence for adding a required
`pending` content field.

## 3. Before merge

- [ ] Credit block sits **above** the body, states in Hebrew that this is a
      translation, and links `original.url`. (CI asserts the credit
      *precedes* the body.)
- [ ] Closing credit repeats the "read the original" link.
- [ ] `original.title` and `original.author` stay in Latin script.
- [ ] Renders `<html lang="he" dir="rtl">`; code blocks stay `dir="ltr"`.
- [ ] **No hreflang alternates** — the English counterpart is not on this
      site.
- [ ] **No `rel="canonical"` to the original.** A translation is not a
      duplicate; canonicalising would delete the Hebrew page from Hebrew
      search results.
- [ ] Translator's notes, if any, are visually distinct and explicitly
      labelled.
- [ ] The `T://bendet` mark is not translated or transliterated.
- [ ] `rights` is complete: `basis`, `url`, `consultedAt`.

## 4. After merge

- [ ] Back-link PR opened (§2) and its URL recorded.
- [ ] `/colophon/` still accurate if this changed anything about the stack.

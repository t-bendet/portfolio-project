---
name: publish-translation
description: The publish-time checklist for a Hebrew translation — licence check, credit placement, and the upstream back-link PR that the translation grant requires. Use whenever adding or shipping an entry in the translations collection.
---

# Publishing a translation

A translation is not published when it renders. It is published when its
**licence conditions are satisfied** — and two of those conditions live
outside the content model entirely, which is why they are here
(`content-model.md` §9).

Work top to bottom. Do not mark the work item done with anything unchecked.

## 0. Whose terms apply?

**Do this first, every time.** The standing grant that covers most of this
collection is *Kent C. Dodds's, for his posts*. It says nothing about any
other author.

- **KCD article** → the grant applies; go to §1.
- **Any other author** → there is no permission until you have one. Get it
  in writing, record it in `rights` (`basis`, `url`, `consultedAt`), and do
  not publish before it exists.

`rights.consultedAt` matters because a grant published in a repo can be
edited or withdrawn — record when you actually read it, not when you
remember reading it.

## 1. The three grant conditions

From the upstream `CONTRIBUTING.md` (`content-model.md` §4.0):

1. **Publish on your own site.** `/he/writing/[id]/` satisfies this. Do not
   offer the translation upstream — he explicitly does not manage
   translations in his repository.
2. **Open a PR on his repo** adding this translation to the post's
   `translations:` frontmatter: language, link, translator name, translator
   link. **See §2 — this is the one that gets skipped.**
3. **Begin the translation by stating it is a translation and linking the
   original.** Not a style preference: the permission rests on it.

## 2. The back-link PR

**Open the PR in the same work item that publishes the translation.** Not
after, not "next time I'm in that repo."

This is the obligation `content-model.md` §9 names as "most likely to be
skipped at article #7, and nothing in the content model will catch it."
Nothing here catches it either — verifying it would mean querying a third
party's repo state, and a check that fails when someone else's server is
down is a check that gets disabled. **This checklist is the only mechanism,
and it only works if you actually run it.**

Record the PR URL in the work item's PR description, so the record survives
the session.

**If a translation ever ships without its back-link PR:** that is the
friction evidence that justifies reopening M4's rejected alternative — a
required content field admitting `pending`. Say so rather than quietly
fixing it; a near-miss is the only data that decision will ever get.

## 3. Before merge

- [ ] Credit block sits **above** the body, states in Hebrew that this is a
      translation, and links `original.url`. CI asserts the credit *precedes*
      the body — assertion 2 exists to test the actual obligation, not the
      presence of a string.
- [ ] Closing credit repeats the "read the original" link.
- [ ] `original.title` and `original.author` stay in Latin script (they are
      the original's own title and a proper name).
- [ ] Renders `<html lang="he" dir="rtl">`; code blocks stay `dir="ltr"`.
- [ ] **No hreflang alternates** — ADR 0023 narrows ADR 0019 here. The
      English counterpart is not on this site. Reading 0019 alone gets this
      wrong; that is exactly what the `narrowed by` note in `INDEX.md` is for.
- [ ] **No `rel="canonical"` to the original.** A translation is not a
      duplicate; canonicalising would ask search engines to drop the Hebrew
      page from Hebrew results and delete the section from the web.
- [ ] Translator's notes, if any, are visually distinct and explicitly
      labelled.
- [ ] The `T://bendet` mark is not translated or transliterated.
- [ ] `rights` is complete: `basis`, `url`, `consultedAt`.

## 4. After merge

- [ ] Back-link PR opened (§2) and its URL recorded.
- [ ] `/colophon/` still accurate if this changed anything about the stack
      (`content-model.md` §9 item 2 — a stale colophon actively misinforms).

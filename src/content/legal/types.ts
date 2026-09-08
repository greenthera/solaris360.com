export interface LegalSection {
  heading?: string
  /** paragraphs; a string starting with "- " renders as a bullet list item */
  body: string[]
}

export interface LegalDoc {
  title: string
  updated?: string
  intro?: string[]
  sections: LegalSection[]
}

import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"

import { companySchema, legalSchema } from "@/config/schemas"

const legal = defineCollection({
  name: "legal",
  directory: "../data/legal",
  include: "**/*.mdx",
  schema: () => legalSchema.shape,
  transform: async (document, context) => {
    const html = await compileMDX(context, document)
    return {
      ...document,
      html,
    }
  },
})

const company = defineCollection({
  name: "company",
  directory: "../data/company",
  include: "**/*.mdx",
  schema: () => companySchema.shape,
  transform: async (document, context) => {
    const html = await compileMDX(context, document)
    return {
      ...document,
      html,
    }
  },
})

export default defineConfig({
  collections: [legal, company],
})

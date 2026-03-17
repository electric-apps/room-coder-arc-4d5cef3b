import { describe, it, expect } from "vitest"
import { todoInsertSchema, todoSelectSchema } from "@/db/zod-schemas"
import { generateValidRow, parseDates } from "./helpers/schema-test-utils"

describe("todo insert validation", () => {
	it("accepts a valid insert", () => {
		const row = generateValidRow(todoInsertSchema)
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("rejects insert without title", () => {
		const row = { ...generateValidRow(todoInsertSchema) }
		delete (row as Record<string, unknown>).title
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(false)
	})
})

describe("JSON round-trip", () => {
	it("parseDates correctly handles ISO date strings in select schema", () => {
		const row = generateValidRow(todoSelectSchema)
		const serialized = JSON.parse(JSON.stringify(row))
		const parsed = parseDates(serialized)
		const result = todoSelectSchema.safeParse(parsed)
		expect(result.success).toBe(true)
	})

	it("parseDates correctly handles ISO date strings in insert schema", () => {
		const row = generateValidRow(todoInsertSchema)
		const serialized = JSON.parse(JSON.stringify(row))
		const parsed = parseDates(serialized)
		const result = todoInsertSchema.safeParse(parsed)
		expect(result.success).toBe(true)
	})
})

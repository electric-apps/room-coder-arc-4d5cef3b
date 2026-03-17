import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { todoInsertSchema } from "@/db/zod-schemas";
import { generateTxId, parseDates } from "@/db/utils";

const json = (data: unknown, status = 200) =>
	new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json" },
	});

export const Route = createFileRoute("/api/mutations/todos")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const raw = parseDates(await request.json());
					const result = todoInsertSchema.safeParse(raw);
					if (!result.success) {
						return json({ error: "Invalid input", details: result.error.issues }, 400);
					}
					const txid = await db.transaction(async (tx) => {
						await tx.insert(todos).values(result.data);
						return generateTxId(tx);
					});
					return json({ txid });
				} catch (err) {
					const message = err instanceof Error ? err.message : "Internal server error";
					return json({ error: message }, 500);
				}
			},
		},
	},
});

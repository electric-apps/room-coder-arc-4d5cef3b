import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { todoSelectSchema } from "@/db/zod-schemas";
import { generateTxId, parseDates } from "@/db/utils";

const json = (data: unknown, status = 200) =>
	new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json" },
	});

export const Route = createFileRoute("/api/mutations/todos/$id")({
	server: {
		handlers: {
			PATCH: async ({ request, params }) => {
				try {
					const raw = parseDates(await request.json());
					const result = todoSelectSchema.safeParse(raw);
					if (!result.success) {
						return json({ error: "Invalid input", details: result.error.issues }, 400);
					}
					const txid = await db.transaction(async (tx) => {
						await tx.update(todos).set(result.data).where(eq(todos.id, params.id));
						return generateTxId(tx);
					});
					return json({ txid });
				} catch (err) {
					const message = err instanceof Error ? err.message : "Internal server error";
					return json({ error: message }, 500);
				}
			},
			DELETE: async ({ params }) => {
				try {
					const txid = await db.transaction(async (tx) => {
						await tx.delete(todos).where(eq(todos.id, params.id));
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

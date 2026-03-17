import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { generateTxId, parseDates } from "@/db/utils";

export const Route = createFileRoute("/api/mutations/todos")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const body = parseDates(await request.json());
				const txid = await db.transaction(async (tx) => {
					await tx.insert(todos).values(body);
					return generateTxId(tx);
				});
				return new Response(JSON.stringify({ txid }), {
					headers: { "Content-Type": "application/json" },
				});
			},
		},
	},
});

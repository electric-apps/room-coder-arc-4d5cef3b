import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { generateTxId, parseDates } from "@/db/utils";

export const Route = createFileRoute("/api/mutations/todos/$id")({
	server: {
		handlers: {
			PATCH: async ({ request, params }) => {
				const body = parseDates(await request.json());
				const txid = await db.transaction(async (tx) => {
					await tx.update(todos).set(body).where(eq(todos.id, params.id));
					return generateTxId(tx);
				});
				return new Response(JSON.stringify({ txid }), {
					headers: { "Content-Type": "application/json" },
				});
			},
			DELETE: async ({ params }) => {
				const txid = await db.transaction(async (tx) => {
					await tx.delete(todos).where(eq(todos.id, params.id));
					return generateTxId(tx);
				});
				return new Response(JSON.stringify({ txid }), {
					headers: { "Content-Type": "application/json" },
				});
			},
		},
	},
});

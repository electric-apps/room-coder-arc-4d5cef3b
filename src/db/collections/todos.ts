import { createCollection } from "@tanstack/db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { type Todo, todoSelectSchema } from "../zod-schemas";

export const todosCollection = createCollection(
	electricCollectionOptions({
		id: "todos",
		schema: todoSelectSchema,
		getKey: (todo: Todo) => todo.id,
		shapeOptions: {
			url: `${typeof window !== "undefined" ? window.location.origin : ""}/api/todos`,
		},
		onInsert: async ({ transaction }) => {
			const todo = transaction.mutations[0].modified;
			const res = await fetch("/api/mutations/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(todo),
			});
			const data = await res.json();
			return { txid: data.txid };
		},
		onUpdate: async ({ transaction }) => {
			const todo = transaction.mutations[0].modified;
			const res = await fetch(`/api/mutations/todos/${todo.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(todo),
			});
			const data = await res.json();
			return { txid: data.txid };
		},
		onDelete: async ({ transaction }) => {
			const todo = transaction.mutations[0].original;
			const res = await fetch(`/api/mutations/todos/${todo.id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			return { txid: data.txid };
		},
	}),
);

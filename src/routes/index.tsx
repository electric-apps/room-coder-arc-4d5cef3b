import {
	Badge,
	Button,
	Card,
	Checkbox,
	Container,
	Flex,
	Heading,
	IconButton,
	SegmentedControl,
	Spinner,
	Text,
	TextField,
} from "@radix-ui/themes";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { Inbox, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { todosCollection } from "@/db/collections/todos";
import type { Todo } from "@/db/zod-schemas";

export const Route = createFileRoute("/")({
	ssr: false,
	component: TodosPage,
});

type Filter = "all" | "active" | "completed";

function TodosPage() {
	const [input, setInput] = useState("");
	const [filter, setFilter] = useState<Filter>("all");

	const { data: todos, isLoading } = useLiveQuery((q) =>
		q.from({ todos: todosCollection }).orderBy(({ todos }) => todos.createdAt),
	);

	const filteredTodos = todos?.filter((todo: Todo) => {
		if (filter === "active") return !todo.completed;
		if (filter === "completed") return todo.completed;
		return true;
	});

	const activeCount = todos?.filter((t: Todo) => !t.completed).length ?? 0;

	function addTodo() {
		const title = input.trim();
		if (!title) return;
		setInput("");
		const now = new Date();
		todosCollection.insert({
			id: crypto.randomUUID(),
			title,
			completed: false,
			createdAt: now,
			updatedAt: now,
		});
	}

	function toggleTodo(todo: Todo) {
		todosCollection.update(todo.id, (draft) => {
			draft.completed = !draft.completed;
			draft.updatedAt = new Date();
		});
	}

	function deleteTodo(todo: Todo) {
		todosCollection.delete(todo.id);
	}

	if (isLoading) {
		return (
			<Container size="2" py="9">
				<Flex align="center" justify="center">
					<Spinner size="3" />
				</Flex>
			</Container>
		);
	}

	return (
		<Container size="2" py="6">
			<Flex direction="column" gap="5">
				<Flex justify="between" align="center">
					<Heading size="7">Todos</Heading>
					{activeCount > 0 && (
						<Badge color="violet" variant="soft" size="2">
							{activeCount} remaining
						</Badge>
					)}
				</Flex>

				{/* Add todo */}
				<Flex gap="2">
					<TextField.Root
						placeholder="What needs to be done?"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && addTodo()}
						style={{ flex: 1 }}
						size="3"
					/>
					<Button size="3" onClick={addTodo} disabled={!input.trim()}>
						<Plus size={16} />
						Add
					</Button>
				</Flex>

				{/* Filter */}
				{todos && todos.length > 0 && (
					<SegmentedControl.Root
						value={filter}
						onValueChange={(v) => setFilter(v as Filter)}
						size="2"
					>
						<SegmentedControl.Item value="all">All</SegmentedControl.Item>
						<SegmentedControl.Item value="active">Active</SegmentedControl.Item>
						<SegmentedControl.Item value="completed">
							Completed
						</SegmentedControl.Item>
					</SegmentedControl.Root>
				)}

				{/* Todo list */}
				{filteredTodos && filteredTodos.length > 0 ? (
					<Flex direction="column" gap="2">
						{filteredTodos.map((todo: Todo) => (
							<Card key={todo.id} variant="surface">
								<Flex align="center" gap="3" justify="between">
									<Flex align="center" gap="3">
										<Checkbox
											size="2"
											checked={todo.completed}
											onCheckedChange={() => toggleTodo(todo)}
											color="violet"
										/>
										<Text
											size="3"
											color={todo.completed ? "gray" : undefined}
											style={{
												textDecoration: todo.completed
													? "line-through"
													: "none",
											}}
										>
											{todo.title}
										</Text>
									</Flex>
									<IconButton
										size="1"
										variant="ghost"
										color="red"
										onClick={() => deleteTodo(todo)}
									>
										<Trash2 size={14} />
									</IconButton>
								</Flex>
							</Card>
						))}
					</Flex>
				) : (
					<Flex direction="column" align="center" gap="3" py="9">
						<Inbox size={48} strokeWidth={1} color="var(--gray-8)" />
						<Text size="4" color="gray">
							{filter === "all" ? "No todos yet" : `No ${filter} todos`}
						</Text>
						{filter === "all" && (
							<Text size="2" color="gray">
								Type something above and press Enter or click Add
							</Text>
						)}
					</Flex>
				)}
			</Flex>
		</Container>
	);
}

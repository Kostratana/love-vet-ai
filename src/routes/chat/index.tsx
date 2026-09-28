import { createFileRoute } from "@tanstack/react-router";
import { ChatWindow } from "@/components/chat/ChatWindow";

export const Route = createFileRoute("/chat/")({
  component: () => <ChatWindow threadId={null} />,
});

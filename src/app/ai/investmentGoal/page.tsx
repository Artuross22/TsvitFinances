"use client";

import { investmentGoalPost } from "@/api/ai";
import Chat from "../chat/page";

export const Page = () => {
    return (
        <Chat
            onSendMessage={investmentGoalPost}
            title="Investment Goal Assistant"
            emptyStateMessage="Ask me about your investment goals and I'll help you plan!"
        />
    );
}

export default Page;
import { useState } from 'react';
import Sidebar from '../components/chat/Sidebar';
import ChatHeader from '../components/chat/ChatHeader';
import ChatArea from '../components/chat/ChatArea';
import SettingsModal from '../components/chat/SettingsModal';

const ChatPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

    const handleNewChat = () => {
        setSelectedConversationId(null);
    };

    const handleConversationCreated = (id: string) => {
        setSelectedConversationId(id);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-void font-sans">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                onOpenSettings={() => setIsSettingsOpen(true)}
                selectedConversationId={selectedConversationId}
                onSelectConversation={setSelectedConversationId}
                onNewChat={handleNewChat}
            />

            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
                <ChatHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 relative overflow-hidden">
                    <ChatArea
                        conversationId={selectedConversationId}
                        onConversationCreated={handleConversationCreated}
                    />

                    {/* Overlay for mobile when sidebar is open */}
                    {isSidebarOpen && (
                        <div
                            className="absolute inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}
                </main>
            </div>

            {/* Settings Modal */}
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
};

export default ChatPage;

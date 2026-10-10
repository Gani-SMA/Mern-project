import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { HomeSection } from "./components/HomeSection";
import { SubmitComplaintSection } from "./components/SubmitComplaintSection";
import { TicketHubSection } from "./components/TicketHubSection";
import { TrackSection } from "./components/TrackSection";
import { KnowledgeBaseSection } from "./components/KnowledgeBaseSection";
import { OperationsHubSection } from "./components/OperationsHubSection";
import { TicketDetailModal } from "./components/TicketDetailModal";
import { ArticleModal } from "./components/ArticleModal";
import { SuccessModal } from "./components/SuccessModal";
import { AuthModal } from "./components/AuthModal";
import { ResolveBotWidget } from "./components/ResolveBotWidget";
import { ToastContainer } from "./components/ToastContainer";
import { Footer } from "./components/Footer";

const MainContent = () => {
  const { activeTab } = useApp();

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        {/* Operations Dashboard is the default landing view */}
        {activeTab === "analytics" && <OperationsHubSection />}
        {activeTab === "home" && <HomeSection />}
        {activeTab === "submit" && <SubmitComplaintSection />}
        {activeTab === "tickets" && <TicketHubSection />}
        {activeTab === "track" && <TrackSection />}
        {activeTab === "kb" && <KnowledgeBaseSection />}
      </main>

      {/* Modals & Overlays */}
      <AuthModal />
      <TicketDetailModal />
      <ArticleModal />
      <SuccessModal />

      {/* AI Assistant & Notifications */}
      <ResolveBotWidget />
      <ToastContainer />

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

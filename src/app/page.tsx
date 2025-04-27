import { MainContent } from "@/components/main-content";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-muted/30">
      <main className="flex-1 container max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <MainContent />
      </main>
    </div>
  );
}

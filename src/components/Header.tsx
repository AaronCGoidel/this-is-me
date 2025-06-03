import HamburgerMenu from "./HamburgerMenu";

export default function Header({
  handlePromptClick,
  handleResetChat,
}: {
  handlePromptClick: (prompt: string) => void;
  handleResetChat: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-end items-center h-20 px-4">
        <HamburgerMenu
          onPromptClick={handlePromptClick}
          onResetChat={handleResetChat}
          className="relative top-0 right-0"
        />
      </div>
    </header>
  );
}

// app/(user)/layout.js
import Topbar from "@/components/Main/Topbar";
import Navbar from "@/components/Main/Navbar";
import Footer from "@/components/Main/Footer";
import MenuBar from "@/components/Main/MenuBar";
import MultiChatFAB from "@/components/Main/MultiChatFAB";

export default function UserLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />
      <Navbar />
      <MenuBar />
      <main className="flex-grow">{children}</main>
      <MultiChatFAB />
      <Footer />
    </div>
  );
}
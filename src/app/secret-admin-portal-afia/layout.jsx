import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function SecretAdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
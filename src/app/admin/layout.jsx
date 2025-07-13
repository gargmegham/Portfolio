export const metadata = {
  title: "Admin Panel | Megham Garg",
  description: "Admin panel for managing blog posts and subscribers",
};

export default function AdminLayout({ children }) {
  return <div className="min-h-screen bg-gray-900">{children}</div>;
}

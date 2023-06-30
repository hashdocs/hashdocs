import Footer from "./_components/footer";
import Navbar from "./_components/navbar";
import MobileNav from "./_components/navbar_mobile";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-1 flex-col items-center">
      <Navbar />
      <MobileNav />
      {children}
      <Footer />
    </section>
  );
}

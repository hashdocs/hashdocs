import Footer from './_components/footer';
import Navbar from './_components/navbar';
import MobileNav from './_components/navbar_mobile';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="hashdocs-scrollbar flex flex-col w-full h-full bg-gray-50">
      <Navbar />
      <MobileNav />
      {children}
      <Footer />
    </section>
  );
}

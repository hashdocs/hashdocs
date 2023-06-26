import Footer from "./_components/footer";
import Navbar from "./_components/navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-1 flex-col items-center">
      <Navbar />
      {children}
      <Footer />
    </section>
  );
}

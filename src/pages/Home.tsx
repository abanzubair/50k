import CustomerNav from '@/components/CustomerNav';
import Hero from '@/sections/Hero';
import Sarees from '@/sections/Sarees';
import OrderTracking from '@/sections/OrderTracking';
import About from '@/sections/About';
import Footer from '@/sections/Footer';

export default function Home() {
  return (
    <div className="relative">
      <CustomerNav />
      <main>
        <Hero />
        <Sarees />
        <OrderTracking />
        <About />
      </main>
      <Footer />
    </div>
  );
}

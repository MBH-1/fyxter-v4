import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function IphoneScreenRepairMontreal() {
  return (
    <>
      <Helmet>
        <title>iPhone Screen Repair in Montreal | Same-Day Service – Fyxters</title>
        <meta
          name="description"
          content="Broken iPhone screen? Get same-day iPhone screen repair in Montreal by vetted local technicians. Transparent pricing, warranty included."
        />
      </Helmet>

      <main className="container mx-auto px-4 py-10 max-w-5xl">
        {/* HERO */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          iPhone Screen Repair in Montreal – Same Day, Trusted Technicians
        </h1>

        <p className="text-lg text-gray-700 mb-8">
          Cracked or broken iPhone screen? Fyxters offers fast and reliable
          iPhone screen repair in Montreal, performed by vetted local
          technicians. Most repairs are completed the same day, with transparent
          pricing and warranty-backed parts.
        </p>

        {/* MODELS */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            iPhone Models We Repair
          </h2>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-600">
            <li><Link to="/repair/iphone/iphone-11-pro-max">iPhone 11 / 11 Pro / 11 Pro Max</Link></li>
            <li><Link to="/repair/iphone/iphone-12">iPhone 12 / 12 Pro / 12 Pro Max</Link></li>
            <li><Link to="/repair/iphone/iphone-13">iPhone 13 / 13 Pro / 13 Pro Max</Link></li>
            <li><Link to="/repair/iphone/iphone-14">iPhone 14 / 14 Pro / 14 Pro Max</Link></li>
            <li><Link to="/repair/iphone/iphone-15">iPhone 15 / 15 Pro / 15 Pro Max</Link></li>
            <li><Link to="/repair/iphone/iphone-16">iPhone 16 / 16 Plus / 16 Pro / 16 Pro Max</Link></li>
          </ul>
        </section>

        {/* SAME DAY */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            Same-Day iPhone Screen Repair in Montreal
          </h2>
          <p className="text-gray-700">
            Most iPhone screen repairs are completed the same day, often in under
            an hour depending on the model and part availability. Once you book,
            the nearest qualified technician is assigned to your repair.
          </p>
        </section>

        {/* PRICING */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            Transparent iPhone Screen Repair Pricing
          </h2>
          <p className="text-gray-700">
            iPhone screen repair prices in Montreal typically range from{" "}
            <strong>$89 to $249</strong>, depending on the model and screen type.
            Final pricing is always shown upfront before confirmation.
          </p>
        </section>

        {/* LOCATION */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            Serving All of Montreal
          </h2>
          <p className="text-gray-700">
            Our technicians serve customers across Montreal, including Downtown,
            Plateau-Mont-Royal, Mile End, Laval, Brossard, and the West Island.
          </p>
        </section>

        {/* TRUST */}
        <section className="mb-10 bg-gray-50 p-6 rounded-lg">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <li>✔ Vetted local technicians</li>
            <li>✔ Warranty on parts</li>
            <li>✔ Transparent pricing</li>
            <li>✔ Secure online booking</li>
          </ul>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Book Your iPhone Screen Repair in Montreal
          </h2>
          <Link
            to="/"
            className="inline-block bg-black text-white px-8 py-4 rounded-lg text-lg hover:opacity-90"
          >
            Book iPhone Repair
          </Link>
        </section>
      </main>
    </>
  );
}

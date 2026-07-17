import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { site } from "@/lib/site";

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* soft painterly blossom accent, echoing the brand's floral mood */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-12 hidden h-[440px] w-[440px] bg-contain bg-no-repeat opacity-60 lg:block"
          style={{ backgroundImage: "url(/samples/blossom-spray.svg)" }}
        />
        <div className="container-x relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="font-heading text-sm uppercase tracking-[0.3em] text-brand-accent">
              New Season
            </p>
            <h1 className="mt-4 text-4xl leading-tight text-brand-ink sm:text-5xl lg:text-6xl">
              Grace woven into
              <br /> every thread
            </h1>
            <p className="mt-5 max-w-md text-brand-muted">
              {site.tagline}. Discover handpicked kurtas and sarees crafted for
              comfort, colour, and quiet elegance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary">
                Shop the collection
              </Link>
              <Link href="/shop?category=saree" className="btn-outline">
                Explore sarees
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-card">
                <Image
                  src="/samples/rosewood-saree.svg"
                  alt="Featured saree"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-card">
                <Image
                  src="/samples/marigold-kurta.svg"
                  alt="Featured kurta"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category tiles */}
      <section className="container-x grid gap-5 py-6 sm:grid-cols-2">
        <CategoryTile
          href="/shop?category=kurta"
          title="Kurtas"
          subtitle="Everyday elegance"
          image="/samples/sage-anarkali.svg"
        />
        <CategoryTile
          href="/shop?category=saree"
          title="Sarees"
          subtitle="For every celebration"
          image="/samples/indigo-saree.svg"
        />
      </section>

      {/* Featured products */}
      <section className="container-x py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl text-brand-ink">Handpicked for you</h2>
            <p className="mt-2 text-brand-muted">
              A few favourites from the collection.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden text-sm font-medium text-brand-primary underline underline-offset-4 sm:block"
          >
            View all
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      {/* Promise strip */}
      <section className="border-y border-brand-line bg-brand-surface">
        <div className="container-x grid gap-8 py-12 text-center sm:grid-cols-3">
          <Assurance title="Handpicked quality" text="Every piece chosen with care." />
          <Assurance title="Fair prices" text="Boutique craft, honest pricing." />
          <Assurance title="Made in India" text="Celebrating local artistry." />
        </div>
      </section>
    </div>
  );
}

function CategoryTile({
  href,
  title,
  subtitle,
  image,
}: {
  href: string;
  title: string;
  subtitle: string;
  image: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex aspect-[16/10] items-end overflow-hidden rounded-card"
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-surface/85 via-brand-surface/20 to-transparent" />
      <div className="relative p-6 [text-shadow:0_1px_10px_rgba(252,249,244,0.95)]">
        <p className="text-sm uppercase tracking-widest text-brand-primary">
          {subtitle}
        </p>
        <h3 className="font-heading text-3xl text-brand-ink">{title}</h3>
      </div>
    </Link>
  );
}

function Assurance({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <p className="font-heading text-xl text-brand-ink">{title}</p>
      <p className="mt-1 text-sm text-brand-muted">{text}</p>
    </div>
  );
}

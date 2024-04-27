import ProductCard from './ProductCard';

export default function ProductGrid({collection, url}) {
  return (
    <section className="grid w-full gap-4 md:gap-8">
      <div className="grid grid-flow-row grid-cols-2 gap-2 gap-y-6 md:gap-4 lg:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {collection.products.nodes.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

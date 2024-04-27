import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';

export default function ProductCard({product}) {
  const {price, compareAtPrice} = product.variants?.nodes[0] || {};
  const isDiscounted = compareAtPrice?.amount > price?.amount;

  return (
    <Link to={`/products/${product.handle}`}>
      <div className="grid gap-6">
        <div className="relative rounded shadow-sm">
          {isDiscounted && (
            <label className="absolute top-0 right-0 m-4 text-xs subpixel-antialiased text-right text-red-600 text-notice">
              Sale
            </label>
          )}
          <Image data={product.variants.nodes[0].image} alt={product.title} />
        </div>
        <div className="grid gap-1">
          <h3 className="w-full overflow-hidden max-w-prose text-copy whitespace-nowrap text-ellipsis ">
            {product.title}
          </h3>
          <div className="flex gap-4">
            <span className="flex gap-4 whitespace-pre-wrap max-w-prose inherit text-copy">
              <Money withoutTrailingZeros data={price} />
              {isDiscounted && (
                <Money
                  className="line-through opacity-50"
                  withoutTrailingZeros
                  data={compareAtPrice}
                />
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

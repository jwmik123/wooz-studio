import {OrbitControls, Stats} from '@react-three/drei';
import {Canvas} from '@react-three/fiber';
import {useState, useEffect, createContext, useContext} from 'react';
import Experience from '~/components/Experience';
import {json} from '@shopify/remix-oxygen';
import {useLoaderData, Link, useNavigate} from '@remix-run/react';
import ProductOptions from '~/components/ProductOptions';
import Intro from '~/components/Intro';

export function meta() {
  return [{title: 'Wooz'}, {description: 'Have a great day!'}];
}

export async function loader({params, context, request}) {
  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  const selectedOptions = [];

  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
  });

  const {product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: 'have-a-great-day-ls-tee-cobalt-white',
      selectedOptions,
    },
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  return json({
    product,
  });
}

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const [enterSite, setEnterSite] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return newProgress;
      });
    }, 1000); // Example timeout
  }, []);

  // if (!enterSite) {
  //   return (
  //     <Intro
  //       loading={loading}
  //       progress={progress}
  //       onEnter={() => setEnterSite(true)}
  //     />
  //   );
  // }

  return <FullscreenCanvas />;
}

function FullscreenCanvas() {
  const [sidebar, setSidebar] = useState(false);
  function handleSidebar() {
    setSidebar(!sidebar);
  }
  useEffect(() => {
    const updateSize = () => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.style.width = `100vw`;
        canvas.style.height = `100vh`;
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // console.log('Have A Great Day', hagdCollection.collection);
  // console.log('First Collection', firstCollection.collection);
  // console.log('Every Day Collection', everyDayCollection.collection);

  return (
    <>
      <Canvas
        flat
        style={{
          width: '100vw',
          height: '100vh',
          display: 'block',
          background: '#adedcd',
        }}
        camera={{fov: 45, near: 0.1, far: 150, position: [7, -0.1, 0]}}
      >
        <Experience />
        <Stats />
      </Canvas>
      <div className="absolute top-0 right-0" onClick={handleSidebar}>
        OPen
      </div>
      {sidebar && <SideBar handleSidebar={handleSidebar} />}
    </>
  );
}

const SideBar = ({handleSidebar}) => {
  const {product} = useLoaderData();
  console.log(product);
  return (
    <section className="fixed top-0 right-0 h-screen w-[300px] bg-white ">
      <button onClick={handleSidebar}>close</button>
      <h2 className="font-bold whitespace-pre-wrap max-w-prose text-lead">
        {product.title}
      </h2>
      <ProductOptions options={product.options} />
    </section>
  );
};

const PRODUCT_QUERY = `#graphql
  query product($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {
    product(handle: $handle) {
      id
      title
      handle
      vendor
      description
      descriptionHtml
      featuredImage{
        id
        url
        altText
        width
        height
      }
      options {
        name,
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
        image {
          id
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        sku
        title
        unitPrice {
          amount
          currencyCode
        }
        product {
          title
          handle
        }
      }
      variants(first: 1) {
        nodes {
          id
          title
          availableForSale
          price {
            currencyCode
            amount
          }
          compareAtPrice {
            currencyCode
            amount
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;

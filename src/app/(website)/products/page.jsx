import ProductCard from "@/components/Main/ProductCard";
import ProductToolbar from "@/components/Main/ProductToolbar";
import SubBanner from "@/components/Main/SubBanner";
import Pagination from "@/components/Main/Pagination";
import FilterProduct from "@/components/Main/FilterProduct";

export const metadata = {
  title: "All Products || Afis Creation",
  description: "Afis Creation all products page",
};

const ProductsPage = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  const selectedCategory = resolvedSearchParams.category || "all";
  const selectedColor = resolvedSearchParams.color || "all";
  const sortBy = resolvedSearchParams.sort || "default";
  const limit = parseInt(resolvedSearchParams.limit || "16", 10);
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const minPrice = parseInt(resolvedSearchParams.minPrice || "0", 10);
  const maxPrice = parseInt(resolvedSearchParams.maxPrice || "999999", 10);
  const view = resolvedSearchParams.view || "4";

  // তোর লোকাল ব্যাকএন্ড থেকে ডেটা ফেচ করার ব্যবস্থা
  let productsData = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/products`, { cache: 'no-store' });
    const result = await res.json();
    
    // ব্যাকএন্ডের রেসপন্স স্ট্রাকচার অনুযায়ী ডেটা অ্যারে নিশ্চিত করা
    productsData = result.data || result; 
    if (!Array.isArray(productsData)) {
      productsData = [];
    }
  } catch (error) {
    console.error("Error fetching products from backend:", error);
    productsData = [];
  }

  let filteredProducts = selectedCategory === "all"
    ? productsData
    : productsData.filter((product) => product.category === selectedCategory);

  filteredProducts = filteredProducts.filter(
    (product) => product.price >= minPrice && product.price <= maxPrice
  );

  if (selectedColor !== "all") {
    filteredProducts = filteredProducts.filter((product) => 
      product.title.toLowerCase().includes(selectedColor) || 
      (product.description && product.description.toLowerCase().includes(selectedColor))
    );
  }

  if (sortBy === "low-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "high-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "popularity") {
    filteredProducts = [...filteredProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === "latest") {
    filteredProducts = [...filteredProducts].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  const totalResults = filteredProducts.length;
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const displayedProducts = filteredProducts.slice(startIndex, endIndex);
  const currentShowing = displayedProducts.length;

  return (
    <section className="w-full">
      <div>
        <SubBanner title={"All Products"} pageName={"Products"} />
      </div>
      <div className="container mx-auto px-4 sm:px-6 md:px-0 pt-6 md:pt-10">
        <div className="pb-16 md:pb-26">
          <ProductToolbar totalProducts={totalResults} currentShowing={currentShowing} />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6 items-start">
            
            {/* Left Sidebar with sticky positioning */}
            <div className="lg:col-span-1 sticky top-24">
              <FilterProduct />
            </div>

            {/* Right Side: Products Grid */}
            <div className="lg:col-span-3">
              <div
                className={`grid grid-cols-2 gap-3 md:gap-6 w-full ${
                  view === "5"
                    ? "md:grid-cols-3 lg:grid-cols-4"
                    : "md:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {displayedProducts.length > 0 ? (
                  displayedProducts.map((product) => (
                    <div key={product._id || product.id} className="w-full flex">
                      <ProductCard product={product} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full w-full text-center py-20 flex flex-col items-center justify-center">
                    <p className="text-gray-500 font-medium text-lg md:text-2xl">
                      Product Not Found
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 md:mt-12">
                <Pagination
                  totalProducts={totalResults}
                  limit={limit}
                  currentPage={currentPage}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
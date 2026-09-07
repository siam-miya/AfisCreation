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
  const minPrice = resolvedSearchParams.minPrice || "";
  const maxPrice = resolvedSearchParams.maxPrice || "";
  const view = resolvedSearchParams.view || "4";

  let productsData = [];

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    
    // 🟢 ব্যাকএন্ডে সরাসরি প্যারামিটার পাঠানোর জন্য URL Query গঠন
    const queryParams = new URLSearchParams();
    if (selectedCategory !== "all") queryParams.append("category", selectedCategory);
    if (selectedColor !== "all") queryParams.append("color", selectedColor);
    if (minPrice) queryParams.append("minPrice", minPrice);
    if (maxPrice) queryParams.append("maxPrice", maxPrice);

    const res = await fetch(`${apiUrl}/api/products?${queryParams.toString()}`, { cache: 'no-store' });
    const result = await res.json();
    
    productsData = result.data || result.products || []; 
    if (!Array.isArray(productsData)) {
      productsData = [];
    }
  } catch (error) {
    console.error("Error fetching products from backend:", error);
    productsData = [];
  }

  // 🟢 সর্টিং লজিক
  if (sortBy === "low-high") {
    productsData.sort((a, b) => a.price - b.price);
  } else if (sortBy === "high-low") {
    productsData.sort((a, b) => b.price - a.price);
  } else if (sortBy === "popularity") {
    productsData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === "latest") {
    productsData.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  const totalResults = productsData.length;
  const startIndex = (currentPage - 1) * limit;
  const displayedProducts = productsData.slice(startIndex, startIndex + limit);
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
            
            {/* Left Sidebar */}
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
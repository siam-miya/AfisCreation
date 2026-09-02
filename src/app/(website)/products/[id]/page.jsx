import ProductDetailsSection from "@/components/Main/ProductDetailsSection";
import SectionHeading from "@/components/Main/SectionHeading";
import SubBanner from "@/components/Main/SubBanner";
import RelatedProductsSlider from "@/components/Main/RelatedProductsSlider"; 

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(`http://localhost:5000/api/products/${id}`, { cache: 'no-store' });
    const data = await res.json();
    return {
      title: data.success && data.data ? `${data.data.title} || Afis Creation` : "Product Details",
      description: data.success && data.data ? data.data.description : "Afis Creation product details page",
    };
  } catch {
    return { title: "Product Details || Afis Creation" };
  }
}

const ProductDetailsPage = async ({ params }) => {
  const { id } = await params;

  // ১. ব্যাকএন্ড থেকে সিঙ্গেল প্রোডাক্ট ফেচ করা
  const res = await fetch(`http://localhost:5000/api/products/${id}`, { cache: 'no-store' });
  const result = await res.json();
  const findData = result.success ? result.data : null;

  if (!findData) {
    return <div className="text-center py-20 font-bold text-red-500">Product Not Found!</div>;
  }

  // ২. একই ক্যাটাগরির রিলেটেড প্রোডাক্ট ফেচ করা
  const relatedRes = await fetch(`http://localhost:5000/api/products/category/${findData.category}/${findData._id}`, { cache: 'no-store' });
  const relatedResult = await relatedRes.json();
  const relatedProducts = relatedResult.success ? relatedResult.data : [];

  return (
    <section>
      <div>
        <SubBanner title={"Product Details"} pageName={"Product Details"}/>
      </div>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="pt-6">
          <p className="hidden md:block text-black font-semibold mb-6">
            <span className="font-bold text-black">Product Name:</span> {findData.title}
          </p>
          
          <div className="mb-10">
            <ProductDetailsSection product={findData} />
          </div>
          
          {relatedProducts.length > 0 && (
            <div className="pb-16 w-full overflow-hidden">
              <div className="mb-8">
                <SectionHeading subHeading={"Related Item"} countDown={false}/>
              </div>
              <RelatedProductsSlider relatedProducts={relatedProducts} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsPage;
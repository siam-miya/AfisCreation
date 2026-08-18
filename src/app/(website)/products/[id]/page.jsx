import ProductDetailsSection from "@/components/Main/ProductDetailsSection";
import SectionHeading from "@/components/Main/SectionHeading";
import SubBanner from "@/components/Main/SubBanner";
import RelatedProductsSlider from "@/components/Main/RelatedProductsSlider"; 

const ProductDetailsPage = async ({ params }) => {
  const { id } = await params;
  const res = await fetch("https://dummyjson.com/products");
  const data = await res.json();
  const productsData = data.products;
  const findData = productsData.find((item) => item.id == id);

  if (!findData) {
    return <div className="text-center py-20 font-bold">Product Not Found!</div>;
  }

  const relatedRes = await fetch(`https://dummyjson.com/products/category/${findData.category}`);
  const relatedData = await relatedRes.json();
  const relatedProducts = relatedData.products.filter((item) => item.id !== findData.id).slice(0, 10);

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
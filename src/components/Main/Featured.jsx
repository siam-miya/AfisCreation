import NewArrivalsProducts from "./NewArrivalsProducts"
import SectionHeading from "./SectionHeading"

const Featured = () => {
  return (
    <section className="mt-10 md:mt-20 w-full">
      <div className="container mx-auto px-4 md:px-0">
        <div className="flex items-center justify-start md:justify-start mb-6 md:mb-10">
          <SectionHeading subHeading={"Featured"} heading={"New Arrival"} countDown={false} />
        </div>
        <div>
          <NewArrivalsProducts />
        </div>
      </div>
    </section>
  )
}

export default Featured
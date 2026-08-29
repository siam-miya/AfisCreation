import ContactFormSection from "@/components/Main/ContacFormSection";
import SubBanner from "@/components/Main/SubBanner";

export const metadata = {
  title: "Contact || Afis Creation",
  description: "Afis Creation contact page",
};
const Contact = () => {
  return (
    <section>
      <div>
        <SubBanner title={"Contact"} pageName={"Contact"} />
      </div>
      <div className="container">
        <div>
          <ContactFormSection />
        </div>
      </div>
    </section>
  )
}

export default Contact


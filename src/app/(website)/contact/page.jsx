import ContactFormSection from "@/components/Main/ContacFormSection";
import SubBanner from "@/components/Main/SubBanner";

export const metadata = {
  title: "Contact || ClassyBazar",
  description: "classyBazar contact page",
  icons: {
    icon: "/favContact.png",
  },
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


import Header from "@/components/content/header";
import Footer from "@/components/content/footer";
import PropertyForm from "@/components/content/propertyForm";



export default async function Property({ searchParams }: any) {
  return (
    <div >
      <Header />
      <main className="flex-grow flex flex-col items-center sm:items-start p-8 sm:p-20">
        <div className="w-full ">
            <PropertyForm />
        </div>
        
      </main>
      <div>
      <Footer />
      </div>
    </div>
  );
}
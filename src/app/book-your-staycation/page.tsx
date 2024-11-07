import Header from "@/components/content/header";
import Footer from "@/components/content/footer";
import BookingForm from "@/components/content/bookingForm"




export default async function Property({ searchParams }: any) {
  return (
    <div >
      <Header />
      <main className="flex-grow flex flex-col items-center sm:items-start p-8 sm:p-20">
        <div className="w-full">
        <div  className="flex flex-col items-start w-full space-y-2 sm:items-start sm:w-1/2">
            <h2 className="text-4xl font-bold mb-4">Book your Staycation!</h2>
            <p className="text-lg flex-wrap text-black">Where do you wanna stay?</p>
            </div>
          
           <div>
            <BookingForm />
           </div>
        </div>
        
      </main>
      <div>
      <Footer />
      </div>
    </div>
  );
}
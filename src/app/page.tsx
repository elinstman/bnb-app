import LoginForm from "@/components/auth/loginform";
import Header from "@/components/content/header";
import Footer from "@/components/content/footer";
import Properties from "@/components/content/properties";



export default async function Home({ searchParams }: any) {
  return (
    <div >
      <Header />
      <main className="flex-grow flex flex-col items-center sm:items-start p-8 sm:p-20">
        <div className="w-full ">
          <Properties />
        </div>
        
      </main>
      <div>
      <Footer />
      </div>
    </div>
  );
}
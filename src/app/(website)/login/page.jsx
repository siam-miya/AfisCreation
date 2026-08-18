import Image from 'next/image'
import main_logo from "../../../public/main-logo.png"
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';

export const metadata = {
  title: "Login || classyBazar",
  description: "classybazar Login page",
  icons: {
    icon: "/favLogin.svg",
  },
};

const Login = () => {
  return (
    <section className="px-4 py-8 md:py-16">
      <div className="container mx-auto">
        <div className='flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-[50px]'>
          <div className='w-full lg:w-[950px] flex justify-center'>
            <Image
              src={main_logo}
              height={781}
              width={950}
              alt='logo'
              className="w-full max-w-[300px] md:max-w-[500px] lg:max-w-[950px] h-auto object-contain"
            />
          </div>
          <div className='w-full max-w-[500px]'>
            <h2 className="text-[28px] md:text-[36px] font-medium text-black font-inter leading-tight">
              Log in to Classy Bazar
            </h2>
            <p className="mt-2 md:mt-4 text-[14px] md:text-[16px] text-black font-poppins">
              Enter your details below
            </p>

            <form className="mt-6 md:mt-10 space-y-5 md:space-y-8">
              <div>
                <input
                  type="email"
                  placeholder="Email or Phone Number"
                  className="w-full border-b border-gray-300 pb-2 outline-none text-[14px] md:text-[16px] placeholder:text-gray-400"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border-b border-gray-300 pb-2 outline-none text-[14px] md:text-[16px] placeholder:text-gray-400"
                />
              </div>

              <button
                type="submit"
                className="cursor-pointer text-[14px] md:text-[16px] w-full bg-[#eb6e1b] text-white py-3 md:py-4 rounded hover:bg-black font-poppins transition"
              >
                Log In
              </button>

              <button
                type="button"
                className="cursor-pointer text-[14px] md:text-[16px] w-full border border-gray-300 py-3 md:py-4 rounded flex items-center justify-center gap-3 hover:bg-gray-50 transition"
              >
                <FcGoogle size={22} />
                Sign In with Google
              </button>

              <p className="text-center text-[14px] text-gray-600">
                <Link href={"/"} className="font-semibold text-[#eb6e1b] hover:text-black underline">
                  Forget Password ?
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
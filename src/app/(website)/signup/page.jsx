import Image from 'next/image'
import main_logo from "../../../../public/main-logo.png"
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';

export const metadata = {
  title: "Signup || classyBazar",
  description: "classybazar signup page",
  icons: {
    icon: "/favSignup.svg",
  },
};

const SignUp = () => {
  return (
    <section className="px-5">
      <div className="container mx-auto">
        <div className='flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-[50px] py-10'>
          <div className='w-full lg:w-[950px] flex justify-center'>
            <Image
              src={main_logo}
              height={781}
              width={950}
              alt='logo'
              className="w-full h-auto object-contain"
            />
          </div>
          <div className='w-full max-w-[500px]'>
            <h2 className="text-[36px] font-medium text-black font-inter leading-7">
              Create an account
            </h2>
            <p className="mt-4 text-[16px] text-black font-poppins leading-6">
              Enter your details below
            </p>
            <form className="mt-10 space-y-8">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full border-b border-gray-300 pb-2 outline-none placeholder:text-gray-400"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email or Phone Number"
                  className="w-full border-b border-gray-300 pb-2 outline-none placeholder:text-gray-400"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border-b border-gray-300 pb-2 outline-none placeholder:text-gray-400"
                />
              </div>

              <button
                type="submit"
                className="cursor-pointer w-full bg-[#eb6e1b] text-white py-4 rounded hover:bg-black transition font-poppins"
              >
                Create Account
              </button>

              <button
                type="button"
                className="cursor-pointer w-full border border-gray-300 py-4 rounded flex items-center font-poppins justify-center gap-3 hover:bg-gray-50 transition"
              >
                <FcGoogle size={25} />
                Sign up with Google
              </button>
              <p className="text-center text-gray-600">
                Already have account?{" "}
                <Link href={"/login"} className="font-semibold text-[#eb6e1b] hover:text-black transition-all underline">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignUp
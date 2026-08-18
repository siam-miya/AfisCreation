"use client"
import Image from "next/image"
import Link from "next/link"
import { MdOutlineKeyboardArrowRight } from "react-icons/md"
import { Swiper, SwiperSlide } from "swiper/react"
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import { Pagination, Autoplay } from 'swiper/modules'
import banner_1 from "../../assets/images/banner.jpg"
import banner_2 from "../../assets/images/banner_2.jpg"
import banner_3 from "../../assets/images/banner_3.jpg"
import apple from "../../assets/icons/apple.png"

const Banner = () => {
    return (
        <section className="ml-0 lg:ml-67  md:px-3 lg:px-0">
            <div className='container mx-auto'>
                <div className='overflow-hidden custom-swiper relative w-full md:w-[720px] lg:w-[1050px] mx-auto'>
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={1}
                        loop={true}
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
                        modules={[Pagination, Autoplay]}
                        className="w-full h-full"
                    >
                        <SwiperSlide className="flex items-center justify-center font-poppins text-[16px] leading-6">
                            <SliderItem
                                image={banner_1}
                                brandLogo={apple}
                                brandTitle={"iphone 14 seris"}
                                discount={"10%"} />
                        </SwiperSlide>
                        <SwiperSlide className="flex items-center justify-center">
                            <SliderItem
                                image={banner_2}
                                brandLogo={apple}
                                brandTitle={"iphone x seris"}
                                discount={"40%"} />
                        </SwiperSlide>
                        <SwiperSlide className="flex items-center justify-center">
                            <SliderItem
                                image={banner_3}
                                brandLogo={apple}
                                brandTitle={"iphone 15 seris"}
                                discount={"20%"} />
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </section>
    )
}

export default Banner

function SliderItem({ image, brandLogo, brandTitle, discount }) {
    return (
        <div
            style={{ backgroundImage: `url(${image.src})` }}
            className='w-full lg:w-[1050px] h-[260px] sm:h-[300px] md:h-[340px] lg:h-[386px] bg-cover bg-center bg-no-repeat p-6 sm:p-8 lg:p-12 flex items-center justify-start'
        >
            <div className='space-y-2 sm:space-y-4 z-10 max-w-[240px] sm:max-w-[300px] pl-2 sm:pl-6 text-left'>
                <p className='flex items-center gap-2 sm:gap-3 text-white text-xs sm:text-sm tracking-wide font-poppins capitalize'>
                    <Image src={brandLogo} height={24} width={20} alt='brandLogo' className="object-contain sm:h-[30px] sm:w-[24px]" />
                    {brandTitle}
                </p>
                <h1 className='text-white font-bold text-[24px] sm:text-[32px] lg:text-[40px] leading-[1.2] font-poppins'>
                    Up to {discount} <br /> off Voucher
                </h1>
                <Link href={"/"} className='inline-flex items-center gap-2 text-white cursor-pointer group mt-1 sm:mt-2'>
                    <span className='border-b border-white pb-0.5 group-hover:border-transparent transition-all text-xs sm:text-sm font-medium'>
                        Shop Now
                    </span>
                    <MdOutlineKeyboardArrowRight size={18} className="group-hover:translate-x-1 transition-transform sm:size-[20px]" />
                </Link>
            </div>
        </div>
    )
}
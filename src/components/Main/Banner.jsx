"use client"

import Link from "next/link"
import { MdOutlineKeyboardArrowRight } from "react-icons/md"
import { Swiper, SwiperSlide } from "swiper/react"
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import { Pagination, Autoplay } from 'swiper/modules'
import banner_1 from "../../assets/images/subBanner.png"
import banner_2 from "../../assets/images/banner_2.png"
import banner_3 from "../../assets/images/banner-3.png"

const Banner = () => {
    return (
        <section className="ml-0 md:px-3 lg:px-0 w-full">
            <div className='w-full'>
                <div className='overflow-hidden custom-swiper relative w-full'>
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={1}
                        loop={true}
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        modules={[Pagination, Autoplay]}
                        className="w-full h-full"
                    >
                        <SwiperSlide className="flex items-center justify-center font-poppins text-[16px] leading-6">
                            <SliderItem
                                image={banner_1}
                                category={"Exclusive Collection"}
                                title="Elegant Abaya"
                                discount={"10%"} />
                        </SwiperSlide>
                        <SwiperSlide className="flex items-center justify-center">
                            <SliderItem
                                image={banner_2}
                                category={"New Arrival"}
                                title="Latest Hijab Trends"
                                discount={"40%"} />
                        </SwiperSlide>
                        <SwiperSlide className="flex items-center justify-center">
                            <SliderItem
                                image={banner_3}
                                category={"Limited Time Offer"}
                                title="Flash Mega Sale"
                                discount={"20%"} />
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </section>
    )
}

export default Banner

function SliderItem({ image, category, title, discount }) {
    return (
        <div
            style={{ backgroundImage: `url(${image.src})` }}
            className='w-full h-[60vh] bg-cover bg-center bg-no-repeat relative p-6 sm:p-8 lg:p-12 flex items-center justify-start'
        >
            {/* Background Overlay for text readability */}
            <div className='absolute inset-0 bg-black/35 z-0'></div>

            <div className='space-y-3 sm:space-y-4 z-10 max-w-[280px] sm:max-w-[360px] pl-2 sm:pl-6 text-left'>
                {/* Category / Subtitle */}
                <p className='flex items-center gap-2 sm:gap-3 text-gray-200 font-semibold text-xs sm:text-sm tracking-widest font-poppins uppercase'>
                    {category}
                </p>

                {/* Main Catchy Heading */}
                <h1 className='text-white font-bold text-[24px] sm:text-[32px] lg:text-[40px] leading-[1.2] font-poppins'>
                    Up to {discount} <br /> off on {title}
                </h1>

                {/* Call to Action Link */}
                <Link href={"/products"} className='inline-flex items-center gap-2 text-white cursor-pointer group mt-1 sm:mt-2'>
                    <span className='border-b border-white pb-0.5 group-hover:border-transparent transition-all text-xs sm:text-sm font-medium'>
                        ShopNow
                    </span>
                    <MdOutlineKeyboardArrowRight size={18} className="group-hover:translate-x-1 transition-transform sm:size-[20px]" />
                </Link>
            </div>
        </div>
    )
}
import React from 'react'
import CountdownTimer from './CountDownTimer'

const SectionHeading = ({ subHeading, heading, countDown = false, navigationButtons }) => {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 md:w-3 h-5 md:h-6 bg-primary rounded-[4px]"></span>
          <span className="text-primary font-bold text-xs md:text-sm tracking-wider uppercase font-poppins">
            {subHeading}
          </span>
        </div>
        <h2 className="text-2xl md:text-[32px] font-bold text-secondary font-inter tracking-tight">
          {heading}
        </h2>
      </div>
      {countDown && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 md:pt-5 gap-2">
          <div className="flex-1 flex justify-start">
            <CountdownTimer />
          </div>
          {navigationButtons && (
            <div className="shrink-0">
              {navigationButtons}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SectionHeading
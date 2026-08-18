import React from 'react';

const CategoryCard = ({ icon: Icon, text }) => {
  return (
    <div className="
      group 
      flex flex-col items-center justify-center 
      border border-gray-300 rounded-[4px] 
      cursor-pointer select-none 
      transition-all duration-300 ease-in-out 
      p-4 md:p-6 
      w-full 
      h-[110px] md:h-[145px] 
      bg-white 
      hover:bg-primary hover:border-primary
    ">
      <div className="flex items-center justify-center text-black group-hover:text-white transition-colors duration-300 mb-2 md:mb-4">
        {Icon && (
          <Icon className="w-10 h-10 md:w-14 md:h-14" />
        )}
      </div>
      <p className="
        font-poppins 
        text-xs md:text-base 
        font-normal 
        text-black group-hover:text-white 
        transition-colors duration-300
        text-center
      ">
        {text}
      </p>
    </div>
  );
};

export default CategoryCard;
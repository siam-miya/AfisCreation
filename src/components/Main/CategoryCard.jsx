import React from 'react';
import { FaShoppingBag } from 'react-icons/fa';

const CategoryCard = ({ icon, text, isActive }) => {
  return (
    <div className={`
      group 
      flex flex-col items-center justify-center 
      border rounded-[4px] 
      cursor-pointer select-none 
      transition-all duration-300 ease-in-out 
      p-4 md:p-6 
      w-full 
      h-[110px] md:h-[145px] 
      ${isActive ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 hover:bg-primary hover:border-primary'}
    `}>
      <div className="flex items-center justify-center text-black group-hover:text-white transition-colors duration-300 mb-2 md:mb-4">
        {typeof icon === 'string' ? (
          <img src={icon} alt={text} className="w-10 h-10 md:w-14 md:h-14 object-cover rounded-md" />
        ) : icon ? (
          React.createElement(icon, { className: "w-10 h-10 md:w-14 md:h-14" })
        ) : (
          <FaShoppingBag className="w-10 h-10 md:w-14 md:h-14" />
        )}
      </div>
      <p className={`
        font-poppins 
        text-xs md:text-base 
        font-normal 
        text-center
        ${isActive ? 'text-white font-medium' : 'text-black group-hover:text-white'}
        transition-colors duration-300
      `}>
        {text}
      </p>
    </div>
  );
};

export default CategoryCard;
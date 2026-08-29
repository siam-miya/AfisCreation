const Button = ({ children, type = "button", TagName = "button", ...props }) => {
  return (
    <TagName
      {...props}
      className='
        inline-block 
        text-[#FAFAFA] 
        bg-primary 
        py-2.5 px-5 
        md:py-3 md:px-7 
        border-none 
        cursor-pointer 
        text-center 
        font-poppins 
        font-medium 
        text-[14px] md:text-[16px] 
        leading-6 
        hover:text-white 
        hover:bg-secondary 
        transition-all 
        rounded-tr-2xl rounded-bl-2xl 
        md:rounded-tr-4xl md:rounded-bl-4xl'
      type={type}
    >
      {children}
    </TagName>
  )
}

export default Button;
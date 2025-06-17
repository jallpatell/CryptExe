export default function() {

    return( 
        <div>
            <nav className="flex items-center  justify-between p-6 max-w-8xl mx-auto">
                <div className="flex items-center space-x-2">
                    <img className='h-15' src='/CRYPTeX (1).png'></img>
                </div> 

                <div className="hidden md:flex items-center space-x-8">
                    <a href="#" className="hover:text-[#6736b3] transition-colors">Home Page</a>
                    <a href="#" className="hover:text-[#6736b3] transition-colors">Portfolio</a>
                    <a href="#" className="hover:text-[#6736b3] transition-colors">Trading</a>
                    <a href="#" className="hover:text-[#6736b3] transition-colors">Contribute</a>
                    <a href="#" className="hover:text-[#6736b3] transition-colors">Settings</a>
                </div>
            </nav>
      </div>
    )
}
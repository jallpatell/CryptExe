export default function() {

    return( 
        <div>
            <nav className="flex items-center  justify-between p-6 max-w-8xl mx-auto">
                <div className="flex items-center space-x-2">
                    <img className='h-15' src='/CRYPTeX (1).png'></img>
                </div> 

                <div className="hidden md:flex items-center space-x-8">
                    <a href="#" className="hover:text-[#6736b3] hover:text-xl font-extrabold transition-colors">Home</a>
                    <a href="#" className="hover:text-[#6736b3] hover:text-xl font-extrabold transition-colors">Wallet</a>
                    <a href="#" className="hover:text-[#6736b3] hover:text-xl font-extrabold transition-colors">Portfolio</a>
                    <a href="#" className="hover:text-[#6736b3] hover:text-xl font-extrabold transition-colors">Contribute</a>
                    <a href="#" className="hover:text-[#6736b3] hover:text-xl font-extrabold transition-colors">Settings</a>
                </div>
            </nav>
      </div>
    )
}
export default function Footer(){
    return <div>
    <footer className="border-2 border-[#000000] bg-black  p-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img src="public/CRYPTeX (1).png" className="h-15 rounded-xl" alt="logo.png"></img>
              <span className="text-lg font-bold">CRYPTeX</span>
            </div>
            <div className="flex gap-15 text-gray-400 ">
                <a className="hover:text-white" rel="noopener noreferrer" target="blank" href="https://backpack.app/terms">TERMS</a>
                <a className="hover:text-white" rel="noopener noreferrer" target="blank" href="https://backpack.app/privacy">PRIVACY</a>
                <a className="hover:text-white" rel="noopener noreferrer" target="blank" href="https://backpack.app/media-kit">Media Kit</a>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 CRYPTeX. Built for the decentralized future.
              <br></br>
              <div className="text-black"> HELLOW STALKER</div>
              <br></br>
                <a href="https://x.com/jallpatell" target="_blank" className="font-extrabold hover:text-white" rel="noopener noreferrer">
                    Reach me @X
                </a>
            </div>
          </div>
        </div>
      </footer>
      </div>
}
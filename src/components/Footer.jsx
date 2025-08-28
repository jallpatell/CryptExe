export default function Footer() {
  return (
      <footer className="bg-gray-900/20 backdrop-blur-lg border-t border-white/10 p-10">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  {/* Logo Section */}
                  <div className="flex items-center space-x-3 group">
                      <div className="p-2 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
                          <img src='/CRYPTeX (1).png' className="h-8 rounded-lg" alt="CRYPTeX Logo" />
                      </div>
                      <span className="text-lg font-bold bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent">
                          CRYPTeX
                      </span>
                  </div>

                  {/* Links Section */}
                  <div className="flex gap-6 text-gray-300/90">
                      <a 
                          className="hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/20"
                          rel="noopener noreferrer" 
                          target="blank" 
                          href="https://backpack.app/terms"
                      >
                          TERMS
                      </a>
                      <a 
                          className="hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/20"
                          rel="noopener noreferrer" 
                          target="blank" 
                          href="https://backpack.app/privacy"
                      >
                          PRIVACY
                      </a>
                      <a 
                          className="hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/20"
                          rel="noopener noreferrer" 
                          target="blank" 
                          href="https://backpack.app/media-kit"
                      >
                          MEDIA KIT
                      </a>
                  </div>

                  {/* Copyright Section */}
                  <div className="text-gray-300/80 text-sm text-center md:text-right">
                      <div className="mb-1">
                          © 2025 CRYPTeX. Built for the decentralized future.
                      </div>
                      <div className="opacity-30 text-black mb-1">
                        <><>.....</></>
                      </div>
                      <a 
                          href="https://x.com/jallpatell" 
                          target="_blank" 
                          className="font-bold hover:text-white transition-colors duration-300"
                          rel="noopener noreferrer"
                      >
                          Reach me on X
                      </a>
                  </div>
              </div>
          </div>
      </footer>
  );
}
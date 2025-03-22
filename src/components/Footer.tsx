
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-lottery-pink text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold mb-2">Montgomery Business Park</h3>
              <p className="text-white/80">1800 Washington Blvd.</p>
              <p className="text-white/80">Suite 330</p>
              <p className="text-white/80">Baltimore, MD 21230</p>
            </div>
            <div>
              <p className="text-white/80">
                Phone: <a href="tel:410.230.8800" className="hover:underline">410.230.8800</a>
              </p>
              <p className="text-white/80">
                Winning Numbers: <a href="tel:410.230.8830" className="hover:underline">410.230.8830</a>
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white/70 transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white/70 transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white/70 transition-colors duration-300">
                <Youtube size={20} />
              </a>
              <a href="#" className="hover:text-white/70 transition-colors duration-300">
                <Twitter size={20} />
              </a>
            </div>
            <div className="space-y-2">
              <Link to="/responsible-play" className="block bg-white text-lottery-pink py-2 px-4 rounded-full text-center font-medium hover:bg-white/90 transition-colors duration-300">
                Responsible Play
              </Link>
              <Link to="/casinos-gaming" className="block bg-white text-lottery-pink py-2 px-4 rounded-full text-center font-medium hover:bg-white/90 transition-colors duration-300">
                Casinos & Gaming
              </Link>
              <Link to="/retailer-corner" className="block bg-white text-lottery-pink py-2 px-4 rounded-full text-center font-medium hover:bg-white/90 transition-colors duration-300">
                Retailer Corner
              </Link>
              <Link to="/contact-us" className="block bg-white text-lottery-pink py-2 px-4 rounded-full text-center font-medium hover:bg-white/90 transition-colors duration-300">
                Contact Us
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center">
              <img 
                src="https://via.placeholder.com/180x60/FFFFFF/333333?text=MARG" 
                alt="Maryland Alliance for Responsible Gambling" 
                className="h-16 object-contain"
              />
            </div>
            <div className="text-white/90 text-sm">
              <p className="mb-4">
                A 24-hour resource for those struggling with a gambling problem. For confidential help or information at any time about gambling problems, please visit{" "}
                <a href="#" className="text-lottery-yellow font-semibold hover:underline">mdgamblinghelp.org</a>{" "}
                or call{" "}
                <a href="tel:1-800-GAMBLER" className="text-lottery-yellow font-semibold hover:underline">1-800-GAMBLER</a>.
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Stop Fraud</h3>
              <p className="text-white/90 text-sm mb-2">
                <a href="#" className="text-lottery-yellow hover:underline">Click here</a> to report fraud and/or abuse of State resources.
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2">Human Trafficking: GET HELP</h3>
              <p className="text-white/90 text-sm">National Human Trafficking Hotline</p>
              <p className="text-white/90 text-sm">24/7 Confidential</p>
              <p className="text-white/90 text-sm">
                Call: <a href="tel:1-888-373-7888" className="text-lottery-yellow hover:underline">1-888-373-7888</a> — Text: <a href="#" className="text-lottery-yellow hover:underline">233733</a>
              </p>
              <p className="text-white/90 text-sm mt-2">
                For more information on human trafficking in Maryland, click{" "}
                <a href="#" className="text-lottery-yellow hover:underline">here</a>.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-1">$20 billion</h2>
              <p className="text-white/90">
                in contribution to the State of Maryland since our inception in 1973.
              </p>
            </div>
            
            <div className="text-white/90 text-sm">
              <p className="mb-4">
                Players must be at least 18 years old to play all Maryland Lottery games. The Maryland Lottery encourages responsible play.
              </p>
              <p className="mb-4">
                The only official winning numbers are the numbers actually drawn. Information should always be verified before it is used in any way.
              </p>
              <p className="mb-4">
                <a href="#" className="text-lottery-yellow hover:underline">Click here</a> for legal information, and{" "}
                <a href="#" className="text-lottery-yellow hover:underline">click here</a> to view Maryland Lottery drawing videos.
              </p>
              <p className="mb-4">
                Your use of this website or Site constitutes your agreement to abide by these{" "}
                <a href="#" className="text-lottery-yellow hover:underline">provisions</a>.
              </p>
            </div>
            
            <div className="text-white/90">
              <h3 className="text-lg font-bold mb-2">Customer Service Promise</h3>
              <p className="text-sm mb-2">
                The State of Maryland pledges to provide constituents, businesses, customers, and stakeholders with friendly and courteous, timely and responsive, accurate and consistent, accessible and convenient, and truthful and transparent services.
              </p>
              <p className="text-sm">
                <a href="#" className="text-lottery-yellow hover:underline">Take our survey</a>.
              </p>
            </div>
            
            <div className="text-center mt-4">
              <button className="text-white hover:text-white/70 inline-flex items-center space-x-1 text-sm font-medium transition-colors duration-300">
                <span>Translate</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-white/20 text-center text-white/70 text-sm">
          <p>© {new Date().getFullYear()} Maryland State Lottery. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

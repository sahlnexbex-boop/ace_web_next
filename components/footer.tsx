import { Facebook, Instagram, Youtube, Twitter, Phone, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-light mb-4">
              Contact{" "}
              <span className="text-cyan-400 font-semibold text-2xl">
                Ace Institute
              </span>
            </h3>

            {/* Phone Numbers */}
            <div className="flex flex-wrap gap-2 text-sm text-gray-300 mb-2 items-center">
              <Phone className="w-4 h-4 text-blue-500" />
              <a href="tel:9995076789" className="hover:text-cyan-400">
                9995076789
              </a>
              <a href="tel:9037363615" className="hover:text-cyan-400">
                9037363615
              </a>
              <a href="tel:9048058888" className="hover:text-cyan-400">
                9048058888
              </a>
              <a href="tel:7994005222" className="hover:text-cyan-400">
                7994005222
              </a>
            </div>

            {/* Emails */}
            <div className="flex flex-wrap gap-2 text-sm text-gray-300 mb-4 items-center">
              <Mail className="w-4 h-4 text-blue-500" />
              <a href="mailto:acemanjeri@gmail.com" className="hover:text-cyan-400">
                acemanjeri@gmail.com
              </a>
              <a href="mailto:info@aceinstitutions.com" className="hover:text-cyan-400">
                info@aceinstitutions.com
              </a>
            </div>

            {/* Social Media Links */}
            <div className="mt-4">
              <h4 className="font-semibold mb-3">Social Media Links</h4>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.facebook.com/aceinstitutions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <Facebook className="w-5 h-5 text-black" />
                </a>
                <a
                  href="https://www.youtube.com/@aceinstitutions_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <Youtube className="w-5 h-5 text-black" />
                </a>
                <a
                  href="https://www.instagram.com/aceinstitutions/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <Instagram className="w-5 h-5 text-black" />
                </a>
                <a
                  href="https://x.com/ace_institute/status/641468102346051584"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <Twitter className="w-5 h-5 text-black" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Learners portal
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Exam & Results
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Highlights
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          {/* Additional Links */}
          <div>
            <ul className="space-y-2 text-gray-300 mt-8 md:mt-0">
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Learners portal
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Exam & Results
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Highlights
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Contact us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Terms and Conditions
              </a>
            </div>
            <p>©2025 Ace Institute. All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

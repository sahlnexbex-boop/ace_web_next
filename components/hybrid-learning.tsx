import { Button } from "@/components/ui/button"

export default function HybridLearning() {
  return (
    <section className="md:py-12 py-10" style={{ backgroundImage: "url('/playstore_background.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          {/* Content */}
          <div className="md:col-span-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 text-center md:text-start">Hybrid Learning Programme</h2>
            <p className="text-xl text-blue-600 mb-6 text-center md:text-start">The Learning App For Online & Offline <br /> Students</p>
            <p className="text-lg text-gray-600 mb-4 text-center md:text-start">Download The App Now</p>

            {/* App Store Buttons */}
            <div className="flex justify-center md:justify-start gap-8">
              <img src="/app_store.png" alt="Apple" className="w-36 h-full" />
              <img src="/play_store.png" alt="Google Play" className="w-36 h-full" />
            </div>
          </div>

          {/* Mobile App Mockup */}
          <div className="relative flex justify-center md:block">
            <img src="/logo_full.png" alt="logo" className="absolute bottom-0 md:-left-24 w-[500px]" />

            <div className="relative z-10 max-w-sm mx-auto">
              <img src="/mockup_device.png" alt="Mobile app interface" className="w-52 h-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
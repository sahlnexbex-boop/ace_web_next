export default function OurFeatures() {
  const offlineFeatures = [
    "Question Paper Discussion",
    "Previous Year On Discussion",
    "SCERT& NCERT Based Classes",
    "Library Facilities",
    "Reading Facilities",
    "AceApp Plus",
    "Offline Mobile App",
    "Students Login",
    "Material Based Discussion",
    "Class Work",
    "Practice Exam",
    "OMR Machine Valuation",
    "Model Exams",
    "Basic maths Classes",
    "Syllabus focused Classes",
  ];

  const onlineFeatures = [
    "Study Materials",
    "Syllabus focused Classes",
    "Current Affairs",
    "Day wise Classes",
    "Topic Exams",
    "Model Exams",
    "Video Classes",
  ];

  return (
    <section className="md:py-16 py-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Heading with line */}
        <div className="relative mb-16 flex justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
            Our Features
          </h2>
          <img
            src="/line_02.png"
            alt="underline"
            className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-28 sm:w-32 md:w-40"
          />
        </div>

        {/* Features Container */}
        <div className="relative">
          {/* Background Image with Gradient Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center z-0 opacity-25"
            style={{
              backgroundImage: "url('/features_background.png')",
              maskImage:
                "linear-gradient(to top, transparent, black 10%, black 90%, transparent), linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to top, transparent, black 10%, black 90%, transparent), linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              maskComposite: "intersect",
              WebkitMaskComposite: "destination-in",
            }}
          ></div>

          <div className="md:space-y-16 space-y-10 relative z-10">
            {/* Offline Course Features */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-[#1F67A5] to-[#29b3ee] bg-clip-text text-transparent">
                Offline Course
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {offlineFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-3 sm:p-4 text-center hover:bg-blue-50 transition-colors cursor-pointer shadow-md"
                  >
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Online Course Features */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-[#1F67A5] to-[#29b3ee] bg-clip-text text-transparent">
                Online Course
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {onlineFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-3 sm:p-4 text-center hover:bg-blue-50 transition-colors cursor-pointer shadow-md"
                  >
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

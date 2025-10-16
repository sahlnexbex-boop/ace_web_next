import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SuccessStories() {
  const stories = [
    {
      id: 1,
      name: "HSA SOCIAL SCIENCE,",
      rank: "1st Rank Holder",
      image: "/testimonial_01.png",
      year: "2024",
      type: "main",
    },
    {
      id: 2,
      title: "Lorem Ipsum is simply",
      description:
        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it...",
      author: "Ashiq Usman K",
      role: "Civil Service Officer",
      type: "testimonial",
      bgColor: "bg-[#022935]",
      avatar: "/girl_01.png",
    },
    {
      id: 3,
      name: "ACE SUCCESS STORY - HSST RANK HOLDER",
      year: "2024",
      image: "/youtube_02.png",
      type: "banner",
    },
    {
      id: 4,
      name: "HSA SOCIAL SCIENCE - 1st Rank Holder",
      description:
        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it...",
      year: "2025",
      image: "/youtube_01.png",
      type: "testimonial",
      bgColor: "bg-[#ffeef7]",
    },
    {
      id: 5,
      title: "Lorem Ipsum is simply",
      description:
        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it...",
      author: "Aswani K",
      avatar: "/boy_01.png",
      role: "Civil Service Officer",
      type: "testimonial",
      bgColor: "bg-[#d3f9ff]",
      textColor: "text-gray-700",
    },
    {
      id: 6,
      quote: '"എന്റെ റാങ്കിന് കാരണം ACE ആണ്" അഭിമാനത്തോടെ പറയുന്നു',
      image: "/testimonial_02.png",
      type: "quote",
      bgColor: "bg-cyan-500",
      textColor: "text-white",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Success Stories
          </h2>
          <div className="mt-2 flex justify-center">
            <img
              src="/line_02.png"
              alt="underline"
              className="h-2 w-32 md:w-40 object-contain"
            />
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <Card className={`overflow-hidden hover:shadow-lg transition-shadow rounded-3xl flex-7`}>
              <CardContent className="p-0 h-full">
                <div className="relative h-full">
                  <img
                    src={stories[0].image}
                    alt={stories[0].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-14 bg-white rounded-xl left-0 right-0 px-6 py-3 mx-4">
                    <h3 className="text-gray-800 font-bold text-xl mb-1">
                      {stories[0].name} <br />
                      <span className="text-md text-gray-700">1st Rank Holder</span>
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`overflow-hidden hover:shadow-lg transition-shadow rounded-3xl flex-4 ${stories[1].bgColor || "bg-white"}`}>
              <CardContent className="p-6">
                <img src="/quates_white.png" alt="" className="mb-2" />
                <h3 className="font-bold text-lg text-gray-200 mb-2">{stories[1].title}</h3>
                <p className="text-sm mb-3 leading-relaxed text-gray-300">
                  {stories[1].description}{" "}
                  <Button variant="link" className="p-0 h-auto text-cyan-600">
                    Read More
                  </Button>
                </p>
                <div className="flex items-center">
                  <img src={stories[1].avatar} alt={stories[1].author} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold text-sm text-white">{stories[1].author}</p>
                    <p className="text-xs opacity-70 text-gray-300">{stories[1].role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            <Card className={`overflow-hidden hover:shadow-lg transition-shadow rounded-3xl flex-5 ${stories[4].bgColor || "bg-white"}`}>
              <CardContent className="p-6">
                <img src="/quates_blue.png" alt="" className="mb-10" />
                <h3 className="font-bold text-lg mb-2">{stories[4].title}</h3>
                <p className="text-sm mb-10 leading-relaxed">
                  {stories[4].description}{" "}
                  <Button variant="link" className="p-0 h-auto text-cyan-600">
                    Read More
                  </Button>
                </p>
                <div className="flex items-center">
                  <img src={stories[4].avatar} alt={stories[4].author} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold text-sm">{stories[4].author}</p>
                    <p className="text-xs opacity-70">{stories[4].role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`overflow-hidden rounded-3xl hover:shadow-lg transition-shadow md:flex-5 flex-6  ${stories[3].bgColor || "bg-[#ffeef7]"}`}>
              <CardContent className="p-0">
                <img src={stories[3].image} alt={stories[3].name} className="w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-xl">{stories[3].name}</h3>
                  <p>{stories[3].description}</p>
                  <div className="text-xs text-gray-100 bg-blue-500 w-fit px-3 py-1 mt-3 rounded-md">{stories[3].year}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            <Card className={`overflow-hidden rounded-3xl hover:shadow-lg transition-shadow flex-3.5 ${stories[2].bgColor || "bg-[#ffeef7]"}`}>
              <CardContent className="p-0">
                <img src={stories[2].image} alt={stories[2].name} className="w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg leading-[18px] text-gray-700">{stories[2].name}</h3>
                  {/* <p>{stories[2].description}</p> */}
                  <div className="text-xs text-gray-100 bg-blue-500 w-fit px-3 py-1 mt-3 rounded-md">{stories[2].year}</div>
                </div>
              </CardContent>
            </Card>

            <Card className={`overflow-hidden relative hover:shadow-lg rounded-3xl transition-shadow flex-6 ${stories[5].bgColor || "bg-white"}`}>
              <CardContent className="p-0">
                <img src={stories[5].image} alt="Success story" className="w-full h-full object-cover" />
                <div className="absolute flex items-end bottom-10 bg-blue-400 me-10 rounded-e-full">
                  <div className="px-6 py-3 md:py-5">
                    <p className="text-white font-bold sm:text-sm text-xs leading-relaxed">{stories[5].quote}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

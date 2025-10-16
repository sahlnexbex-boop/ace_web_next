"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";

export default function Branches() {
  const [selectedBranch, setSelectedBranch] = useState("Calicut");

  const branches = [
    "Calicut",
    "Balussery",
    "Malappuram",
    "Nilambur",
    "Perinthalmanna",
    "Edappal",
    "Tirur",
    "Palakkad",
    "Pattambi",
  ];

  const branchImages = [
    "/branch_01.png",
    "/branch_02.png",
    "/branch_03.png",
    "/branch_04.png",
  ];

  const branchInfo: Record<
    string,
    { description: string; phone: string; images: string[]; map: string }
  > = {
    Calicut: {
      description:
        "Our Calicut branch is located in the heart of the city, providing excellent customer service and its friendly staff and wide product selection.",
      phone: "+91 1234 567 890",
      images: [...branchImages],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125218.54684735388!2d75.72841332197618!3d11.255555506749628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba65938563d4747%3A0x32150641ca32ecab!2sKozhikode%2C%20Kerala!5e0!3m2!1sen!2sin!4v1758428599483!5m2!1sen!2sin",
    },
    Balussery: {
      description:
        "Our Balussery branch is located in the heart of the city, providing excellent customer service and its friendly staff and wide product selection.",
      phone: "+91 9876 543 210",
      images: [
        branchImages[1],
        branchImages[0],
        branchImages[3],
        branchImages[2],
      ],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31284.39497582074!2d75.79794269446599!3d11.440217780096903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6669e3d419681%3A0x919ce065b5707e10!2sBalussery%2C%20Kerala!5e0!3m2!1sen!2sin!4v1758434064569!5m2!1sen!2sin",
    },
    Malappuram: {
      description:
        "Our Malappuram branch is located in the heart of the city, providing excellent customer service and its friendly staff and wide product selection.",
      phone: "+91 9999 888 777",
      images: [
        branchImages[2],
        branchImages[3],
        branchImages[1],
        branchImages[0],
      ],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62651.038623147404!2d76.0271918551829!3d11.061858910676044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba64a9be29b058f%3A0x23e371e0d4c30d8e!2sMalappuram%2C%20Kerala!5e0!3m2!1sen!2sin!4v1758434158044!5m2!1sen!2sin",
    },
    Nilambur: {
      description:
        "Our Nilambur branch is located in the heart of the city, providing excellent customer service and its friendly staff and wide product selection.",
      phone: "+91 8888 777 666",
      images: [
        branchImages[3],
        branchImages[2],
        branchImages[0],
        branchImages[1],
      ],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31301.901305222298!2d76.21317344430236!3d11.280684539607611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba63b7644696f47%3A0x855ba2b7d1add177!2sNilambur%2C%20Kerala!5e0!3m2!1sen!2sin!4v1758434210887!5m2!1sen!2sin",
    },
    Perinthalmanna: {
      description:
        "Our Perinthalmanna branch is located in the heart of the city, providing excellent customer service and its friendly staff and wide product selection.",
      phone: "+91 7777 666 555",
      images: [
        branchImages[0],
        branchImages[2],
        branchImages[1],
        branchImages[3],
      ],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62668.973051159184!2d76.15231159977982!3d10.977647939438771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7cc529833b09b%3A0x1635a9815f140cc2!2sPerinthalmanna%2C%20Kerala!5e0!3m2!1sen!2sin!4v1758434243988!5m2!1sen!2sin",
    },
    Edappal: {
      description:
        "Our Edappal branch is located in the heart of the city, providing excellent customer service and its friendly staff and wide product selection.",
      phone: "+91 6666 555 444",
      images: [
        branchImages[1],
        branchImages[3],
        branchImages[0],
        branchImages[2],
      ],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62668.973051159184!2d76.15231159977982!3d10.977647939438771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7b976d4bc9669%3A0x6081e9175757a3a1!2sEdappal%2C%20Kerala!5e0!3m2!1sen!2sin!4v1758434273591!5m2!1sen!2sin",
    },
    Tirur: {
      description:
        "Our Tirur branch is located in the heart of the city, providing excellent customer service and its friendly staff and wide product selection.",
      phone: "+91 5555 444 333",
      images: [
        branchImages[2],
        branchImages[0],
        branchImages[3],
        branchImages[1],
      ],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62682.5114560296!2d75.87637945458923!3d10.913653396208133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7b18ce2f8645d%3A0x460f5865302bbabc!2sTirur%2C%20Kerala!5e0!3m2!1sen!2sin!4v1758434310543!5m2!1sen!2sin",
    },
    Palakkad: {
      description:
        "Our Palakkad branch is located in the heart of the city, providing excellent customer service and its friendly staff and wide product selection.",
      phone: "+91 4444 333 222",
      images: [
        branchImages[3],
        branchImages[1],
        branchImages[2],
        branchImages[0],
      ],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62708.83233527156!2d76.61270740409273!3d10.788164376351634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba86dfa087d31ad%3A0xf542d6eb7a870a56!2sPalakkad%2C%20Kerala!5e0!3m2!1sen!2sin!4v1758434342729!5m2!1sen!2sin",
    },
    Pattambi: {
      description:
        "Our Pattambi branch is located in the heart of the city, providing excellent customer service and its friendly staff and wide product selection.",
      phone: "+91 3333 222 111",
      images: [
        branchImages[0],
        branchImages[3],
        branchImages[1],
        branchImages[2],
      ],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15676.295792694857!2d76.17976779469916!3d10.805648329516565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7c5d32fa26e1b%3A0x42cdd17f5e236751!2sPattambi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1758434368912!5m2!1sen!2sin",
    },
  };

  return (
    <section className="md:py-16 py-10 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="relative mb-12 flex justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
            Branches
          </h2>
          <img
            src="/line_02.png"
            alt="underline"
            className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-28 md:w-36"
          />
        </div>

        {/* Branch List + Info */}
        <div className="lg:grid lg:grid-cols-3 md:gap-8 gap-5 flex flex-col">
          {/* Branch List */}
          <div className="lg:col-span-1 mb-6 lg:mb-0">
            <div className="space-y-2">
              {branches.map((branch) => (
                <Button
                  key={branch}
                  variant={selectedBranch === branch ? "default" : "outline"}
                  className={`w-full justify-start font-semibold py-4 sm:py-6 ${
                    selectedBranch === branch
                      ? "bg-gradient-to-r from-[#1F67A5] to-[#00A0E3] hover:bg-blue-700 text-white"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                  onClick={() => setSelectedBranch(branch)}
                >
                  <MapPin
                    className={`w-5 h-5 sm:w-6 sm:h-6 mr-2 ${
                      selectedBranch === branch ? "text-white" : "text-blue-500"
                    }`}
                  />
                  {branch}
                </Button>
              ))}
            </div>
          </div>

          {/* Branch Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">
                {selectedBranch}
              </h3>

              <p className="text-gray-600 mb-3 sm:mb-5 leading-relaxed text-sm sm:text-base">
                {branchInfo[selectedBranch]?.description}
              </p>

              <div className="flex items-center mb-3 text-sm sm:text-base">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                <span className="text-gray-700">{branchInfo[selectedBranch]?.phone}</span>
              </div>

              {/* Branch Images */}
              <div className="flex gap-3 overflow-x-auto mb-3 h-14">
                {branchInfo[selectedBranch]?.images.map((image, index) => (
                  <div key={index} className="flex-shrink-0 w-20 sm:w-24 h-full rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${selectedBranch} branch ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>

              {/* Map */}
              <iframe
                src={branchInfo[selectedBranch]?.map}
                loading="lazy"
                className="w-full rounded-xl h-48 sm:h-60"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

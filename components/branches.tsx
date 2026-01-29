"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import { Description } from "@radix-ui/react-toast";

export default function Branches() {
  const [selectedBranch, setSelectedBranch] = useState({
    name: "Calicut",
    Description:
      "Our Calicut branch is located in the centre of the city, has easy accessibility, friendly staff, and a comfortable learning atmosphere.",
    Phone: "7593 002 221",
    email: "acepsccalicut@gmail.com",
  });

  const branches = [
    {
      name: "Calicut",
      Description:
        "Our Calicut branch is located in the centre of the city, has easy accessibility, friendly staff, and a comfortable learning atmosphere.",
      Phone: "7593 002 221",
      email: "acepsccalicut@gmail.com",
    },
    {
      name: "Balussery",
      Description:
        "The Balussery branch is a peaceful and quiet area for students to receive direct help and constant academic support.",
      Phone: "7034 030 306",
      email: "acepscbalussery@gmail.com",
    },
    {
      name: "Malappuram",
      Description:
        "Malappuram branch has a lively atmosphere and committed teachers who help the students to keep their motivation up until the end of the exam preparation",
      Phone: "9846 925 678",
      email: "acemalapuram@gmail.com",
    },
    {
      name: "Nilambur",
      Description:
        "ilambur branch has a junior-friendly environment where the skilled teachers will make the hard-to-understand topics seem simple.",
      Phone: "8893 324 004, 04931 220 221",
      email: "acenilambur@gmail.com",
    },
    {
      name: "Perinthalmanna",
      Description:
        "Perinthalmanna branch has a combination of excellent teaching and a friendly atmosphere that keeps students' morale up and gets them ready for their exams.",
      Phone: "8943 058 888",
      email: "aceperinthalmanna729@gmail.com",
    },
    {
      name: "Edappal",
      Description:
        "Our Edappal branch is a learning centre where students with the commitment of the instructors embrace education and build a strong foundation necessary to crack examinations.",
      Phone: "7593 002 223, 0494 268 5555",
      email: "aceedappal@gmail.com",
    },
    {
      name: "Tirur",
      Description:
        "The Tirur branch is a place where learning is encouraged and the students will not only get the attention but also the clarity they need to pass the competitive exams.",
      Phone: "8129 049 049",
      email: "acethirur@gmail.com",
    },
    {
      name: "Palakkad",
      Description:
        "Palakkad branch has skilled faculty and a calm academic environment which together help the students to stay focused on their goals.",
      Phone: "9072 330 044",
      email: "acepalakkad44@gmail.com",
    },
    {
      name: "Pattambi",
      Description:
        "Our Pattambi branch is characterized by a very nice and inspiring atmosphere where the students not only receive dependable guidance but also enjoy constant progress in their studies.",
      Phone: "7510 239 575",
      email: "acepscpattambi@gmail.com",
    },
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
      phone: "+91 7593 002 221",
      images: [...branchImages],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.0354897015527!2d75.78191267481233!3d11.258799588920853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6593f52be59a5%3A0xcf8150daaf9ed65a!2sACE%20Institutions%20%7C%20PSC%20Coaching%20Center%20CALICUT!5e0!3m2!1sen!2sin!4v1769602908316!5m2!1sen!2sin",
    },
    Balussery: {
      description:
        "Our Balussery branch is located in the heart of the city, providing excellent customer service and its friendly staff and wide product selection.",
      phone: "+91 7034 030 306",
      images: [
        branchImages[1],
        branchImages[0],
        branchImages[3],
        branchImages[2],
      ],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3910.47719408982!2d75.83236387481537!3d11.445442388746958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba66785d2a6c8c7%3A0xfe7213941bad58c7!2sACE%20Institutions%20%7C%20PSC%20Coaching%20Centre%2C%20Balussery!5e0!3m2!1sen!2sin!4v1769603000982!5m2!1sen!2sin",
    },
    Malappuram: {
      description:
        "Our Malappuram branch is located in the heart of the city, providing excellent customer service and its friendly staff and wide product selection.",
      phone: "+91 9846 925 678",
      images: [
        branchImages[2],
        branchImages[3],
        branchImages[1],
        branchImages[0],
      ],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.9274966531484!2d76.07811937480899!3d11.044062789121444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba64a9ec5b4ec07%3A0xfd07f2690735e4fb!2sACE%20Institutions%20%7C%20PSC%20Coaching%20Centre%2C%20Malappuram!5e0!3m2!1sen!2sin!4v1769603096903!5m2!1sen!2sin",
    },
    Nilambur: {
      description:
        "Our Nilambur branch is located in the heart of the city, providing excellent customer service and its friendly staff and wide product selection.",
      phone: "+91 8893 324 004, 04931 220 221",
      images: [
        branchImages[3],
        branchImages[2],
        branchImages[0],
        branchImages[1],
      ],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.649623194259!2d76.23831187481282!3d11.287145888894377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba63b63c0fce0c1%3A0xf7742856e2495642!2sACE%20Institutions%20%7C%20PSC%20Coaching%20Centre%2C%20Nilambur!5e0!3m2!1sen!2sin!4v1769603200290!5m2!1sen!2sin",
    },
    Perinthalmanna: {
      description:
        "Our Perinthalmanna branch is located in the heart of the city, providing excellent customer service and its friendly staff and wide product selection.",
      phone: "+91 8943 058 888",
      images: [
        branchImages[0],
        branchImages[2],
        branchImages[1],
        branchImages[3],
      ],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.834048088797!2d76.22414957480787!3d10.97589578918524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7cd37f9e16807%3A0x52ac5ecd0e69c37d!2sACE%20Institutions%20%7C%20PSC%20Coaching%20Centre%2C%20Perinthalmanna!5e0!3m2!1sen!2sin!4v1769603290522!5m2!1sen!2sin",
    },
    Edappal: {
      description:
        "Our Edappal branch is located in the heart of the city, providing excellent customer service and its friendly staff and wide product selection.",
      phone: "+91 7593 002 223, 0494 268 5555",
      images: [
        branchImages[1],
        branchImages[3],
        branchImages[0],
        branchImages[2],
      ],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.337469542276!2d76.00533477480504!3d10.785444389363851!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7b933313d3d19%3A0xda6f876430b8b163!2sACE%20Institutions%20%7C%20PSC%20Coaching%20Centre%20%7C%20Edappal!5e0!3m2!1sen!2sin!4v1769601247710!5m2!1sen!2sin",
    },
    Tirur: {
      description:
        "Our Tirur branch is located in the heart of the city, providing excellent customer service and its friendly staff and wide product selection.",
      phone: "+91 8129 049 049",
      images: [
        branchImages[2],
        branchImages[0],
        branchImages[3],
        branchImages[1],
      ],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.6395937620946!2d75.923258974807!3d10.914970989242342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7b1ba980b9e11%3A0x4f426035006d3aa1!2sACE%20Institutions%20%7C%20PSC%20Coaching%20Centre%2C%20Tirur!5e0!3m2!1sen!2sin!4v1769600828288!5m2!1sen!2sin",
    },
    Palakkad: {
      description:
        "Our Palakkad branch is located in the heart of the city, providing excellent customer service and its friendly staff and wide product selection.",
      phone: "+91 9072 330 044",
      images: [
        branchImages[3],
        branchImages[1],
        branchImages[2],
        branchImages[0],
      ],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.531764495445!2d76.64884607480485!3d10.770523989377905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba86d002800a31d%3A0xbde50ea8f58a5104!2sACE%20Institutions%20%7C%20PSC%20Coaching%20Centre%2C%20Palakkad!5e0!3m2!1sen!2sin!4v1769601047662!5m2!1sen!2sin",
    },
    Pattambi: {
      description:
        "Our Pattambi branch is located in the heart of the city, providing excellent customer service and its friendly staff and wide product selection.",
      phone: "+91 7510 239 575",
      images: [
        branchImages[0],
        branchImages[3],
        branchImages[1],
        branchImages[2],
      ],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31353.084645389008!2d76.20390064382384!3d10.800926368340356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7c5b1fffb3d95%3A0xdc9534c4da305878!2sACE%20Institutions%20%7C%20PSC%20Coaching%20Centre%20%2C%20Pattambi!5e0!3m2!1sen!2sin!4v1769601158584!5m2!1sen!2sin",
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
              {branches.map((item) => (
                <Button
                  key={item.name}
                  variant={
                    selectedBranch.name === item.name ? "ghost" : "outline"
                  }
                  className={`w-full justify-start font-semibold py-4 cursor-pointer sm:py-6 ${
                    selectedBranch.name === item.name
                      ? "bg-gradient-to-r from-[#1F67A5] to-[#00A0E3] hover:bg-blue-700 text-white"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                  onClick={() => setSelectedBranch(item)}
                >
                  <MapPin
                    className={`w-5 h-5 sm:w-6 sm:h-6 mr-2 ${
                      selectedBranch.name === item.name
                        ? "text-white"
                        : "text-blue-500"
                    }`}
                  />
                  {item.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Branch Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">
                {selectedBranch.name}
              </h3>

              <p className="text-gray-600 mb-3 sm:mb-5 leading-relaxed text-sm sm:text-base">
                {selectedBranch?.Description}
              </p>

              <div className="flex gap-5 items-center mb-3 text-sm sm:text-base">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedBranch.Phone.split(",").map((num, index, arr) => {
                      const cleanNumber = num.replace(/\s/g, "");
                      return (
                        <span key={index} className="flex items-center gap-2">
                          <a
                            href={`tel:${cleanNumber}`}
                            className="text-gray-700 hover:text-blue-600"
                          >
                            {num.trim()}
                          </a>

                          {/* Separator | */}
                          {index < arr.length - 1 && (
                            <span className="text-gray-400 font-semibold">|</span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                  <a
                  href={`tel:${selectedBranch?.Phone.replace(/\s|,/g, "")}`}
                  className="text-gray-700 hover:text-blue-600"
                  >{selectedBranch?.email}</a>
                </div>
              </div>

              {/* Branch Images */}
              <div className="flex gap-3 overflow-x-auto mb-3 h-14">
                {branchInfo[selectedBranch.name]?.images.map((image, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-20 sm:w-24 h-full rounded-lg overflow-hidden"
                  >
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
                src={branchInfo[selectedBranch.name]?.map}
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

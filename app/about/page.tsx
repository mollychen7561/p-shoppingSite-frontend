"use client";

import React from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import {
  TruckIcon,
  ChatBubbleBottomCenterTextIcon,
  GlobeAsiaAustraliaIcon,
  ReceiptPercentIcon
} from "@heroicons/react/24/outline";

export default function AboutPage() {
  const categories = [
    { id: 0, name: "electronics" },
    { id: 1, name: "jewelery" },
    { id: 2, name: "men's clothing" },
    { id: 3, name: "women's clothing" }
  ];

  const features = [
    { icon: TruckIcon, title: "Delivery within 2-3 days" },
    { icon: ChatBubbleBottomCenterTextIcon, title: "Customer service" },
    { icon: GlobeAsiaAustraliaIcon, title: "Sustainable packaging" },
    { icon: ReceiptPercentIcon, title: "Opening event" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Typography variant="h2" color="blue-gray" className="mb-4 text-center">
        About Our Store
      </Typography>

      <Typography variant="lead" className="mb-8 text-center">
        Welcome to Kiwi Shop, your one-stop destination for a wide range of
        high-quality products. We&apos;re committed to providing an exceptional
        shopping experience with our diverse product categories and outstanding
        services.
      </Typography>

      <Typography variant="h4" color="blue-gray" className="mb-4">
        Our Product Categories
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {categories.map((category) => (
          <Card key={category.id} className="mt-6">
            <CardBody>
              <Typography variant="h5" color="blue-gray" className="mb-2">
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </Typography>
              <Typography>
                Discover our wide selection of {category.name} products,
                carefully curated to meet your needs and preferences.
              </Typography>
            </CardBody>
          </Card>
        ))}
      </div>

      <Typography variant="h4" color="blue-gray" className="mb-4">
        Why Choose Us?
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {features.map((feature, index) => (
          <Card key={index} className="mt-6">
            <CardBody className="flex flex-col items-center text-center">
              <feature.icon className="h-12 w-12 mb-4 text-blue-gray-500" />
              <Typography variant="h6" color="blue-gray" className="mb-2">
                {feature.title}
              </Typography>
            </CardBody>
          </Card>
        ))}
      </div>

      <Typography variant="paragraph" className="mb-4">
        At Kiwi Shop, we&apos;re dedicated to providing you with:
      </Typography>
      <ul className="list-disc pl-6 mb-8">
        <li>
          A diverse range of high-quality products across multiple categories
        </li>
        <li>Fast and reliable delivery within 2-3 days</li>
        <li>Exceptional customer service to assist you at every step</li>
        <li>
          Environmentally friendly practices with our sustainable packaging
        </li>
        <li>
          Exciting promotions and events, including our special opening event
        </li>
      </ul>

      <Typography variant="paragraph">
        Whether you&apos;re looking for the latest fashion trends, cutting-edge
        electronics, stylish jewelry, or practical men&apos;s clothing,
        we&apos;ve got you covered. Our team is committed to ensuring your
        shopping experience is seamless, enjoyable, and exceeds your
        expectations.
      </Typography>
    </div>
  );
}

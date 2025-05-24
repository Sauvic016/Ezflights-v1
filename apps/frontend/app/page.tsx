import Link from "next/link";
import Image from "next/image";
import {
  ChevronRightIcon,
  PlaneTakeoffIcon,
  ShieldCheckIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import { Card } from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";

import { JSX, SVGProps } from "react";
import FlightSearch from "@/components/Flights/flight-search";
import React, { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white ">
      <main className="flex-1 pt-16 mx-4 md:mx-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white pt-16 md:p-16 ">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-blue-50 -z-10"></div>

          {/* Decorative patterns */}
          {/* <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 right-[10%] w-72 h-72 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 blur-3xl opacity-70 -z-10"></div>
            <div className="absolute bottom-10 left-[20%] w-96 h-96 rounded-full bg-gradient-to-tr from-purple-100 to-pink-100 blur-3xl opacity-70 -z-10"></div>
            <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-yellow-50 blur-3xl opacity-40 -z-10"></div>
          </div> */}

          {/* Decorative grid pattern */}
          {/* <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.02] -z-10"></div> */}

          <div className="container px-0 md:px-6 relative">
            {/* Main hero content */}
            <div className="text-center max-w-3xl mx-auto ">
              <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm text-sky-600 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-sky-500 mr-2"></span>
                Explore the world with confidence
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                Your journey begins with
                <span className="relative mx-2">
                  <span className="relative z-10 text-sky-600">EzFlights</span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-sky-100 -z-10"></span>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Book flights to over 200 destinations worldwide with our
                easy-to-use platform. Exclusive deals and 24/7 support for the
                perfect travel experience.
              </p>
            </div>

            {/* Search card - floating above */}
            <Suspense fallback={<div>Loading search form...</div>}>
              <FlightSearch />
            </Suspense>
            {/* <FlightSearchComponent /> */}

            {/* Floating trust badges */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 my-8 md:mt-12">
              {[
                {
                  icon: <ShieldCheckIcon className="h-5 w-5 text-sky-500" />,
                  text: "Secure booking",
                },
                {
                  icon: <StarIcon className="h-5 w-5 text-sky-500" />,
                  text: "Best price guarantee",
                },
                {
                  icon: <UsersIcon className="h-5 w-5 text-sky-500" />,
                  text: "24/7 support",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md text-sm"
                >
                  {item.icon}
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Floating destination bubbles */}
            <div className="hidden lg:block">
              <div className="absolute top-32 left-12 w-24 h-24 p-2 rounded-full bg-white shadow-lg flex items-center justify-center transform -rotate-6 ">
                <Image
                  src="/images/paris.jpg"
                  alt="Paris"
                  width={60}
                  height={60}
                  className="rounded-full w-full h-full"
                />
              </div>
              <div className="absolute bottom-40 left-0 w-24 h-24 p-2 rounded-full bg-white shadow-lg flex items-center justify-center transform rotate-3 ">
                <Image
                  src="/images/tokyo.jpg"
                  alt="Tokyo"
                  width={50}
                  height={50}
                  className="rounded-full w-full h-full"
                />
              </div>
              <div className="absolute top-48 right-16 w-24 h-24 p-2 rounded-full bg-transparent shadow-lg flex items-center justify-center transform rotate-6 ">
                <Image
                  src="/images/newyork.jpg"
                  alt="New York"
                  width={80}
                  height={80}
                  className="rounded-full w-full h-full"
                />
              </div>
              <div className="absolute bottom-10 right-0 w-24 h-24 p-2 rounded-full bg-white shadow-lg flex items-center justify-center transform -rotate-3 ">
                <Image
                  src="/images/paris.jpg"
                  alt="Bali"
                  width={50}
                  height={50}
                  className="rounded-full w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <div>
                <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm text-sky-600 mb-4">
                  <span className="flex h-2 w-2 rounded-full bg-sky-500 mr-2"></span>
                  Popular Destinations
                </div>
                <h2 className="text-5xl font-bold">Explore Top Destinations</h2>
                <p className="mt-2 text-gray-600 max-w-lg">
                  Discover our most popular destinations with exclusive deals
                  and offers.
                </p>
              </div>
              <Link href="/destinations">
                <Button
                  variant="ghost"
                  className="hidden md:flex items-center mt-4 md:mt-0 text-sky-600 hover:bg-sky-600 hover:text-white"
                >
                  View All Destinations{" "}
                  <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Paris",
                  image: "/images/paris.jpg",
                  price: "$499",
                  rating: "4.8",
                },
                {
                  name: "Tokyo",
                  image: "/images/tokyo.jpg",
                  price: "$899",
                  rating: "4.9",
                },
                {
                  name: "New York",
                  image: "/images/newyork.jpg",
                  price: "$599",
                  rating: "4.7",
                },
              ].map((destination, index) => (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="relative w-full aspect-square">
                    <Image
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      fill
                      className="object-cover rounded-md h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-medium shadow-md">
                      From {destination.price}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white">
                        {destination.name}
                      </h3>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-white">
                          {destination.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-8 md:hidden">
              <Button
                variant="outline"
                className="rounded-full border-gray-200"
              >
                View All Destinations{" "}
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm text-sky-600 mb-4">
                <span className="flex h-2 w-2 rounded-full bg-sky-500 mr-2"></span>
                Why Choose EzFlights
              </div>
              <h2 className="text-5xl font-bold">Travel with peace of mind</h2>
              <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                We offer the best flight booking experience with exclusive
                benefits and features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <ShieldCheckIcon className="h-8 w-8 text-sky-500" />,
                  title: "Secure Booking",
                  description:
                    "Your payment and personal information are always protected with bank-level security.",
                },
                {
                  icon: <StarIcon className="h-8 w-8 text-sky-500" />,
                  title: "Best Price Guarantee",
                  description:
                    "Find a lower price? We'll match it and give you an extra discount on your booking.",
                },
                {
                  icon: <UsersIcon className="h-8 w-8 text-sky-500" />,
                  title: "24/7 Customer Support",
                  description:
                    "Our support team is available around the clock to assist you with any questions.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold">
                Ready to Start Your Journey?
              </h2>
              <p className="mt-4 text-gray-600">
                Sign up now and get $50 off your first booking. Limited time
                offer.
              </p>

              <div className="mt-8 max-w-md mx-auto">
                <form className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 rounded-lg border-gray-200"
                  />
                  <Button className="bg-sky-500 hover:bg-sky-600 rounded-lg">
                    Sign Up
                  </Button>
                </form>
                <p className="mt-2 text-xs text-gray-500">
                  By signing up, you agree to our{" "}
                  <Link
                    href="#"
                    className="underline underline-offset-2 hover:text-sky-600"
                  >
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function CheckIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

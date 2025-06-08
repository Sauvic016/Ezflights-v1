"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Label } from "@repo/ui/components/ui/label";
import { ChevronLeft, ChevronRight, CornerUpLeft } from "lucide-react";

export default function FlightSkeleton() {
  // Animation for shimmer effect
  const shimmer = {
    hidden: { opacity: 0.3 },
    visible: {
      opacity: 0.7,
      transition: {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 1.2,
      },
    },
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Back button skeleton */}
      <div className="shadow-md rounded p-2 flex w-fit font-semibold cursor-pointer gap-2 bg-gray-100">
        <CornerUpLeft className="text-gray-300" />
        <motion.div
          variants={shimmer}
          initial="hidden"
          animate="visible"
          className="h-5 w-16 bg-gray-200 rounded"
        />
      </div>

      {/* Header skeleton */}
      <div className="my-6 flex flex-wrap justify-between gap-4 items-center">
        <motion.div
          variants={shimmer}
          initial="hidden"
          animate="visible"
          className="h-8 w-40 bg-gray-200 rounded"
        />

        <div className="flex items-end gap-2">
          <div>
            <Label className="text-gray-300">Sort by</Label>
            <motion.div
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className="h-10 w-28 bg-gray-200 rounded mt-1"
            />
          </div>
          <motion.div
            variants={shimmer}
            initial="hidden"
            animate="visible"
            className="h-10 w-32 bg-gray-200 rounded"
          />
        </div>
      </div>

      {/* Recommended flight skeleton */}
      <div className="space-y-6">
        <Card className="bg-gray-100 rounded-xl shadow-xl border transition">
          <CardHeader>
            <div className="flex items-center justify-between">
              <motion.div
                variants={shimmer}
                initial="hidden"
                animate="visible"
                className="h-6 w-40 bg-gray-200 rounded"
              />
              <Badge
                variant="secondary"
                className="bg-gray-200 text-transparent"
              >
                Best Deal
              </Badge>
            </div>
            <motion.div
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className="h-4 w-32 bg-gray-200 rounded"
            />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <motion.div
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  className="h-8 w-8 bg-gray-200 rounded-full"
                />
                <div>
                  <motion.div
                    variants={shimmer}
                    initial="hidden"
                    animate="visible"
                    className="h-5 w-24 bg-gray-200 rounded mb-1"
                  />
                  <motion.div
                    variants={shimmer}
                    initial="hidden"
                    animate="visible"
                    className="h-4 w-36 bg-gray-200 rounded"
                  />
                </div>
              </div>
              <div className="text-right">
                <motion.div
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  className="h-7 w-20 bg-gray-200 rounded mb-1"
                />
                <motion.div
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  className="h-4 w-16 bg-gray-200 rounded"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <motion.div
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className="h-5 w-32 bg-gray-200 rounded"
            />
            <motion.div
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className="h-9 w-24 bg-gray-200 rounded"
            />
          </CardFooter>
        </Card>

        {/* Flight cards skeleton */}
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-gray-100 rounded-lg shadow-md border">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <motion.div
                    variants={shimmer}
                    initial="hidden"
                    animate="visible"
                    className="h-10 w-10 bg-gray-200 rounded-full"
                  />
                  <div>
                    <motion.div
                      variants={shimmer}
                      initial="hidden"
                      animate="visible"
                      className="h-5 w-28 bg-gray-200 rounded mb-1"
                    />
                    <motion.div
                      variants={shimmer}
                      initial="hidden"
                      animate="visible"
                      className="h-4 w-40 bg-gray-200 rounded"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div>
                    <motion.div
                      variants={shimmer}
                      initial="hidden"
                      animate="visible"
                      className="h-5 w-32 bg-gray-200 rounded mb-1"
                    />
                    <motion.div
                      variants={shimmer}
                      initial="hidden"
                      animate="visible"
                      className="h-4 w-24 bg-gray-200 rounded"
                    />
                  </div>
                  <motion.div
                    variants={shimmer}
                    initial="hidden"
                    animate="visible"
                    className="h-10 w-24 bg-gray-200 rounded"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-between items-center mt-6">
        <Button disabled className="bg-gray-200 text-transparent">
          <ChevronLeft className="mr-2 h-4 w-4 text-gray-300" /> Previous
        </Button>
        <motion.div
          variants={shimmer}
          initial="hidden"
          animate="visible"
          className="h-5 w-20 bg-gray-200 rounded"
        />
        <Button disabled className="bg-gray-200 text-transparent">
          Next <ChevronRight className="ml-2 h-4 w-4 text-gray-300" />
        </Button>
      </div>

      {/* Search section skeleton */}
      <div className="mt-12">
        <motion.div
          variants={shimmer}
          initial="hidden"
          animate="visible"
          className="h-8 w-48 bg-gray-200 rounded mb-4"
        />
        <Card className="bg-gray-100 border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                variants={shimmer}
                initial="hidden"
                animate="visible"
                className="h-12 bg-gray-200 rounded"
              />
            ))}
          </div>
          <motion.div
            variants={shimmer}
            initial="hidden"
            animate="visible"
            className="h-10 w-full md:w-36 bg-gray-200 rounded mt-4 ml-auto"
          />
        </Card>
      </div>
    </main>
  );
}

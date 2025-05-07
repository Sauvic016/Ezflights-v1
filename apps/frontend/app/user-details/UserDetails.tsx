"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
// import { useToast } from "@/hooks/use-toast";

import {
  ArrowLeft,
  ChevronRight,
  CircleUser,
  Contact,
  Minus,
  Plus,
  ReceiptText,
} from "lucide-react";

import { useRouter } from "next/navigation";
import FlightCard from "./FlightCard";
import { bookingFormSchema } from "@/schemas/BookingFormSchema";
import { GenderRole, useFlightStore, useUserDetails } from "@/store/Store";
import { FlightData } from "@repo/types";
import { useState } from "react";
import { DatePicker } from "@/components/date-picker";

type FormData = z.infer<typeof bookingFormSchema>;

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function UserDetailPage() {
  // const { toast } = useToast();
  const [travelerCount, setTravelerCount] = useState(1);
  const form = useForm<FormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      travelers: [{
        firstName: "",
        lastName: "",
        gender: "MALE" as const,
        dob: "",
      }],
      countryCode: "",
      bookingCountryCode: "+91",
      bookingMobileNo: "",
      bookingEmail: "",
    },
  });
  const router = useRouter();

  // Get store actions
  const setContact = useUserDetails((state) => state.setContact);
  const addTraveler = useUserDetails((state) => state.addTraveler);
  const clearTravelers = useUserDetails((state) => state.clearTravelers);
  const flight = useFlightStore((state) => state.flight as FlightData);

  const addTravelerField = () => {
    if (travelerCount >= 4) return; // Prevent adding more than 4 travelers
    setTravelerCount((prev) => prev + 1);
    const currentTravelers = form.getValues("travelers") || [];
    form.setValue("travelers", [
      ...currentTravelers,
      { firstName: "", lastName: "", gender: "MALE" as const, dob: "" },
    ]);
  };

  const removeTravelerField = (index: number) => {
    setTravelerCount((prev) => prev - 1);
    const currentTravelers = form.getValues("travelers");
    form.setValue(
      "travelers",
      currentTravelers.filter((_, i) => i !== index),
    );
  };

  function onSubmit(values: FormData) {
    // Clear existing travelers
    console.log("Form submitted with values:", values);
    clearTravelers();

    // Set contact information
    setContact({
      email: values.bookingEmail,
      phone: values.bookingCountryCode + values.bookingMobileNo,
    });

    // Add all travelers
    values.travelers.forEach((traveler) => {
      addTraveler({
        firstName: traveler.firstName,
        lastName: traveler.lastName,
        dob: traveler.dob,
        gender: traveler.gender as GenderRole,
      });
    });

    console.log("Navigating to seat selection...");
    router.push(`/select-seat/${flight.id}`);
  }

  return (
    // <div className="min-h-screen bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20">
    <div className="container mx-auto p-4 pt-32 max-w-4xl">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="space-y-8"
      >
        <motion.div variants={fadeInUp} className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ReceiptText className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary">
            Complete your booking
          </h1>
        </motion.div>

        <FlightCard flight={flight} />

        <motion.div variants={fadeInUp}>
          <Card className="border-2 border-white/20 bg-white/40 shadow-xl">
            <CardHeader className="bg-white/30 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CircleUser className="text-primary" />
                  <CardTitle className="text-xl">Traveler's Details</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addTravelerField}
                    className={`bg-white/50 hover:bg-white/60 ${
                      travelerCount >= 4 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={travelerCount >= 4}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Traveler {travelerCount}/4
                  </Button>
                </div>
              </div>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="py-6">
                  <div className="space-y-8 pl-4">
                    {Array.from({ length: travelerCount }).map((_, index) => (
                      <div key={index} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            Traveler {index + 1}
                          </h3>
                          {index > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTravelerField(index)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Minus className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          )}
                        </div>
                        <div className="flex gap-4">
                          <FormField
                            control={form.control}
                            name={`travelers.${index}.firstName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-semibold">
                                  First Name
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    className="focus-visible:ring-indigo-400"
                                    placeholder="John"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`travelers.${index}.lastName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-semibold">
                                  Last Name
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    className="focus-visible:ring-indigo-400"
                                    placeholder="Doe"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`travelers.${index}.gender`}
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="font-semibold">
                                Gender
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex items-center text-center space-x-1"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="MALE" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Male
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="FEMALE" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Female
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="OTHER" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Other
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`travelers.${index}.dob`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold">
                                Date of Birth
                              </FormLabel>
                              <FormControl>
                                <DatePicker
                                  date={field.value
                                    ? new Date(field.value)
                                    : undefined}
                                  onSelect={(date) => {
                                    field.onChange(
                                      date ? date.toISOString() : "",
                                    );
                                  }}
                                  className="w-full sm:w-[200px] md:w-[250px] lg:w-[300px]"
                                  source="userDetails"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardContent>
                  <div className="flex items-center space-x-1">
                    <Contact className="h-5 w-5 text-primary" />
                    <CardTitle className="my-6">
                      Booking details will be sent to
                    </CardTitle>
                  </div>

                  <div className="space-y-4 pl-4">
                    <div className="flex gap-8">
                      <div className="space-y-2">
                        <div className="text-sm font-semibold">
                          Mobile Number{" "}
                        </div>
                        <div className="flex gap-2">
                          <FormField
                            control={form.control}
                            name="bookingCountryCode"
                            render={({ field }) => (
                              <FormItem>
                                {/* <FormLabel>Country Code</FormLabel> */}
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl className=" focus-visible:ring-indigo-400">
                                    <SelectTrigger>
                                      <SelectValue placeholder="+91" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent defaultValue={"+91"}>
                                    <SelectItem value="+1">+1 (USA)</SelectItem>
                                    <SelectItem value="+44">
                                      +44 (UK)
                                    </SelectItem>
                                    <SelectItem value="+91">
                                      +91 (India)
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="bookingMobileNo"
                            render={({ field }) => (
                              <FormItem>
                                {/* <FormLabel>Mobile Number</FormLabel> */}
                                <FormControl>
                                  <Input
                                    className=" focus-visible:ring-indigo-400"
                                    type="tel"
                                    placeholder="1234567890 (Optional)"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-semibold">Email</div>
                        <FormField
                          control={form.control}
                          name="bookingEmail"
                          render={({ field }) => (
                            <FormItem>
                              {/* <FormLabel>Email</FormLabel> */}
                              <FormControl>
                                <Input
                                  className=" focus-visible:ring-indigo-400"
                                  type="email"
                                  placeholder="john@mail.com (Optional)"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </form>
            </Form>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="flex justify-end space-x-4 pt-4"
        >
          <Button
            variant="outline"
            className="group bg-white/50  -sm border-white/20 hover:bg-white/60"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>
          <Button
            onClick={() => {
              form.handleSubmit(onSubmit)();
            }}
            className="group bg-primary/80  -sm hover:bg-primary/90"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
    // </div>
  );
}

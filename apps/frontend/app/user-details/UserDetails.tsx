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
import {
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  CircleUser,
  Contact,
  ReceiptText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { GenderRole, useFlightStore, useUserDetails } from "@/store/Store";
import { FlightData } from "@repo/types";
import { DatePicker } from "@/components/date-picker";

// Components
import FlightCard from "./FlightCard";
import { bookingFormSchema } from "@/schemas/BookingFormSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";

type FormData = z.infer<typeof bookingFormSchema>;

// Animation variants
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

// Traveler form component to reduce main component complexity
const TravelerForm = ({ index, control }: { index: number; control: any }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold">
          Traveler {index + 1}
        </h3>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <FormField
          control={control}
          name={`travelers.${index}.firstName`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="font-semibold text-sm">
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
          control={control}
          name={`travelers.${index}.lastName`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="font-semibold text-sm">Last Name</FormLabel>
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
        control={control}
        name={`travelers.${index}.gender`}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="font-semibold text-sm">Gender</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col sm:flex-row items-start sm:items-center text-center space-y-2 sm:space-y-0 sm:space-x-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="MALE" />
                  </FormControl>
                  <FormLabel className="font-normal text-sm">Male</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="FEMALE" />
                  </FormControl>
                  <FormLabel className="font-normal text-sm">Female</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="OTHER" />
                  </FormControl>
                  <FormLabel className="font-normal text-sm">Other</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`travelers.${index}.dob`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold text-sm">
              Date of Birth
            </FormLabel>
            <FormControl>
              <DatePicker
                date={field.value ? new Date(field.value) : undefined}
                onSelect={(date) =>
                  field.onChange(date ? date.toISOString() : null)
                }
                className="w-full sm:w-[200px] md:w-[250px] lg:w-[300px]"
                source="userDetails"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

// Contact form component
const ContactForm = ({ control }: { control: any }) => {
  return (
    <div className="space-y-4 pl-2 sm:pl-4">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div className="space-y-2 flex-1">
          <div className="text-sm font-semibold">Mobile Number </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <FormField
              control={control}
              name="bookingCountryCode"
              render={({ field }) => (
                <FormItem className="w-full sm:w-auto">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="focus-visible:ring-indigo-400">
                      <SelectTrigger className="w-full sm:w-[120px]">
                        <SelectValue placeholder="+91" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent defaultValue={"+91"}>
                      <SelectItem value="+1">+1 (USA)</SelectItem>
                      <SelectItem value="+44">+44 (UK)</SelectItem>
                      <SelectItem value="+91">+91 (India)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="bookingMobileNo"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      className="focus-visible:ring-indigo-400"
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
        <div className="space-y-2 flex-1">
          <div className="text-sm font-semibold">Email</div>
          <FormField
            control={control}
            name="bookingEmail"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="focus-visible:ring-indigo-400"
                    type="email"
                    placeholder="john@mail.com"
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
  );
};

export default function UserDetailPage() {
  const router = useRouter();
  const flight = useFlightStore((state) => state.flight as FlightData);
  const travelerlimit = useUserDetails((state) => state.travelerLimit);
  const [showDialog, setShowDialog] = useState(false);

  // Store actions
  const { setContact, addTraveler, clearTravelers } = useUserDetails();

  // Initialize form with default values
  const form = useForm<FormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: useMemo(
      () => ({
        travelers: Array(travelerlimit)
          .fill(0)
          .map(() => ({
            firstName: "",
            lastName: "",
            gender: "MALE" as const,
            dob: "",
          })),
        countryCode: "",
        bookingCountryCode: "+91",
        bookingMobileNo: "",
        bookingEmail: "",
      }),
      [travelerlimit],
    ),
  });

  // Form submission handler
  const onSubmit = useCallback(
    (values: FormData) => {
      if (!flight) {
        console.error("No flight selected");
        return;
      }
      // Validate traveler count matches requirement
      if (values.travelers.length !== travelerlimit) {
        setShowDialog(true);
        return;
      }

      // Clear existing travelers
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

      // Navigate to seat selection
      router.push(`/select-seat/${flight.id}`);
    },
    [
      addTraveler,
      clearTravelers,
      flight?.id,
      router,
      setContact,
      travelerlimit,
    ],
  );

  return (
    <div className="container mx-auto p-4 pt-32 max-w-4xl">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ReceiptText className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary">
            Complete your booking
          </h1>
        </motion.div>

        {/* Flight details */}
        <FlightCard flight={flight} />

        {/* Traveler details form */}
        <motion.div variants={fadeInUp}>
          <Card className="border-2 border-white/20 bg-white/40 shadow-xl">
            <CardHeader className="bg-white/30 border-b border-white/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <CircleUser className="text-primary" />
                  <CardTitle className="text-lg sm:text-xl">
                    Traveler's Details ({travelerlimit}{" "}
                    {travelerlimit === 1 ? "Traveler" : "Travelers"})
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="py-4 sm:py-6">
                  <div className="space-y-6 sm:space-y-8 pl-2 sm:pl-4">
                    {/* Render traveler forms */}
                    {Array.from({ length: travelerlimit }).map((_, index) => (
                      <TravelerForm
                        key={index}
                        index={index}
                        control={form.control}
                      />
                    ))}
                  </div>
                </CardContent>

                {/* Contact information */}
                <CardContent className="pt-0">
                  <div className="flex items-center space-x-1 mb-4 sm:mb-6">
                    <Contact className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <CardTitle className="text-sm">
                      Booking details will be sent to
                    </CardTitle>
                  </div>
                  <ContactForm control={form.control} />
                </CardContent>
              </form>
            </Form>
          </Card>
        </motion.div>

        {/* Navigation buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex justify-end space-x-4 pt-4"
        >
          <Button
            variant="outline"
            className="group bg-white/50 border-white/20 hover:bg-white/60"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="group bg-primary/80 hover:bg-primary/90"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Error Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Complete All Traveler Details
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Please fill in the details for all {travelerlimit} travelers before
            proceeding to seat selection.
          </DialogDescription>
          <div className="flex justify-end">
            <Button variant="default" onClick={() => setShowDialog(false)}>
              Okay, I'll Complete Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

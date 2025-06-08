"use client";

import { MapPinIcon, SearchIcon } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { useEffect, useState } from "react";
import { DatePicker } from "../date-picker";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { AutoComplete } from "../Autocomplete";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { flightSearchSchema } from "@/schemas/FlightSearchSchema";

import { useFlightSearch } from "@/hooks/use-flightSearch";
import { useFlightSearchParams } from "@/hooks/use-flightSearchParams";
import { useUserDetails } from "@/store/Store";
import { ComboBoxResponsive } from "../Combobox";
// import useDebounce from "@/hooks/use-debounce";

type FlightSearchValues = z.infer<typeof flightSearchSchema>;

const SEARCH_URL = `${process.env.NEXT_PUBLIC_flight_service}/api/city/get-city`;

const FlightSearch = () => {
  const [trip, setTrip] = useState<"oneWay" | "roundTrip">("oneWay");
  const [activeField, setActiveField] = useState<"from" | "to" | null>(null);
  const { getSearchParams, updateSearchParams } = useFlightSearchParams();

  const [selectedCities, setSelectedCities] = useState<{
    from: string;
    to: string;
  }>({ from: "", to: "" });

  // const [openDeparture, setOpenDeparture] = useState<boolean>(false);
  // const [openArrival, setOpenArrival] = useState<boolean>(false);

  // const router = useRouter();
  // const searchParams = useSearchParams();

  const { setTravelerLimit } = useUserDetails();

  const form = useForm<FlightSearchValues>({
    resolver: zodResolver(flightSearchSchema),
    defaultValues: getSearchParams(),
  });

  // Add this useEffect to sync trip state with form's flightType
  useEffect(() => {
    const flightType = form.getValues("flightType");
    setTrip(flightType);
  }, [form.getValues("flightType")]);

  // Add this useEffect to monitor form values

  function onSubmit(values: FlightSearchValues) {
    console.log("Submitting values:", values);
    updateSearchParams(values);
  }

  const { city: fromData, isLoading: isFromLoading } = useFlightSearch(
    SEARCH_URL,
    activeField === "from" ? form.watch("from") : "",
  );

  const { city: toData, isLoading: isToLoading } = useFlightSearch(
    SEARCH_URL,
    activeField === "to" ? form.watch("to") : "",
  );

  const handleCitySelect = (
    value: string,
    id: number,
    source: "from" | "to",
  ) => {
    setSelectedCities((prev) => ({ ...prev, [source]: value }));
    form.setValue(source, value);
    setActiveField(null);
  };

  const handleInputChange = (value: string, source: "from" | "to") => {
    setActiveField(source);
    form.setValue(source, value);
  };
  console.log("rendered");

  const handlePassengerCountChange = (travellercount: {
    adults: number;
    children: number;
  }) => {
    const total = Object.values(travellercount).reduce((sum, v) => sum + v, 0);

    setTravelerLimit(Number(total));
  };

  return (
    <div className="relative  max-w-5xl mx-auto">
      {/* Decorative elements */}
      <div className="absolute -top-6 -left-6 w-24 h-24 bg-sky-100 rounded-full -z-10 hidden md:block"></div>
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-full -z-10 hidden md:block"></div>
      <div className="border-white/20 bg-white/40 backdrop-blur-md  rounded-lg p-8 shadow-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* <Card className="border-none shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden"> */}
            {/* <CardContent className="p-6 md:p-8"> */}

            <FormField
              control={form.control}
              name="flightType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Tabs
                      value={field.value}
                      className="w-full"
                      onValueChange={(value) => {
                        field.onChange(value);
                        setTrip(value as "oneWay" | "roundTrip");
                        // Reset returnDate when switching to oneWay
                        if (value === "oneWay") {
                          form.setValue("returnDate", null);
                        } else if (
                          value === "roundTrip" &&
                          !form.getValues("returnDate")
                        ) {
                          // Set a default return date (7 days after departure) when switching to roundTrip
                          const departureDate = form.getValues("departureDate");
                          if (departureDate) {
                            const returnDate = new Date(departureDate);
                            returnDate.setDate(returnDate.getDate() + 7);
                            form.setValue("returnDate", returnDate);
                          }
                        }
                      }}
                    >
                      <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg">
                        <TabsTrigger
                          value="oneWay"
                          className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                          One Way
                        </TabsTrigger>
                        <TabsTrigger
                          value="roundTrip"
                          className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                          Round Trip
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent
                        value={field.value}
                        className="space-y-4 mt-2"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="from"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>From</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <MapPinIcon className="absolute left-1 top-[46%] transform -translate-y-1/2 w-4 h-3 text-gray-400" />
                                    <AutoComplete
                                      value={field.value}
                                      onValueChange={(value) =>
                                        handleInputChange(value, "from")
                                      }
                                      onSelect={(value, id) =>
                                        handleCitySelect(value, id, "from")
                                      }
                                      suggestions={fromData || []}
                                      isLoading={
                                        isFromLoading && activeField === "from"
                                      }
                                      placeholder="Departure City"
                                    />
                                    {/* <ComboBoxResponsive /> */}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* <div className="space-y-2">
                              <label
                                htmlFor="to"
                                className="text-sm font-medium text-gray-700"
                              >
                                To
                              </label>
                              <div className="relative">
                                <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  id="to"
                                  placeholder="City or Airport"
                                  className="pl-9 rounded-lg border-gray-200"
                                />
                              </div>
                            </div> */}
                          <FormField
                            control={form.control}
                            name="to"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>To</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <MapPinIcon className="absolute left-1 top-[46%] transform -translate-y-1/2 w-4 h-3 text-gray-400" />
                                    {/* <Input {...field} className="bg-white/40  pl-6" placeholder="Arrival City" /> */}
                                    <AutoComplete
                                      value={field.value}
                                      onValueChange={(value) =>
                                        handleInputChange(value, "to")
                                      }
                                      onSelect={(value, id) =>
                                        handleCitySelect(value, id, "to")
                                      }
                                      suggestions={toData || []}
                                      isLoading={
                                        isToLoading && activeField === "to"
                                      }
                                      placeholder="Arrival City"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <FormField
                            control={form.control}
                            name="departureDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {trip === "oneWay" ? "Date" : "Dates"}
                                </FormLabel>
                                <FormControl>
                                  {trip === "oneWay" ? (
                                    <DatePicker
                                      date={field.value}
                                      onSelect={field.onChange}
                                      className="w-full"
                                    />
                                  ) : (
                                    <DatePickerWithRange
                                      date={field.value}
                                      onSelect={(range) => {
                                        if (range?.from) {
                                          field.onChange(range.from);
                                          form.setValue(
                                            "returnDate",
                                            range.to || null,
                                          );
                                        } else {
                                          field.onChange(null);
                                          form.setValue("returnDate", null);
                                        }
                                      }}
                                      className="w-full"
                                    />
                                  )}
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="passengers"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Passengers</FormLabel>
                              <FormControl>
                                <Select
                                  value={JSON.stringify(field.value)}
                                  onValueChange={(value) => {
                                    const parsed = JSON.parse(value);
                                    field.onChange(parsed);
                                    handlePassengerCountChange(parsed);
                                  }}
                                >
                                  <SelectTrigger className="rounded-lg border-gray-200">
                                    <SelectValue placeholder="Select passengers">
                                      {field.value
                                        ? `${field.value.adults} Adult${
                                            field.value.adults > 1 ? "s" : ""
                                          }${
                                            field.value.children > 0
                                              ? `, ${field.value.children} Child${
                                                  field.value.children > 1
                                                    ? "ren"
                                                    : ""
                                                }`
                                              : ""
                                          }`
                                        : "Select passengers"}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem
                                      value={JSON.stringify({
                                        adults: 1,
                                        children: 0,
                                      })}
                                    >
                                      1 Adult
                                    </SelectItem>
                                    <SelectItem
                                      value={JSON.stringify({
                                        adults: 2,
                                        children: 0,
                                      })}
                                    >
                                      2 Adults
                                    </SelectItem>
                                    <SelectItem
                                      value={JSON.stringify({
                                        adults: 2,
                                        children: 1,
                                      })}
                                    >
                                      2 Adults, 1 Child
                                    </SelectItem>
                                    <SelectItem
                                      value={JSON.stringify({
                                        adults: 2,
                                        children: 2,
                                      })}
                                    >
                                      2 Adults, 2 Children
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          className="w-full bg-sky-500 hover:bg-sky-600 rounded-lg h-12 mt-2"
                          type="submit"
                        >
                          <SearchIcon className="mr-2 h-4 w-4" /> Search Flights
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </FormControl>
                </FormItem>
              )}
            />
            {/* </CardContent> */}
            {/* </Card> */}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default FlightSearch;

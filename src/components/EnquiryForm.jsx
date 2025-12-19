import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BsWhatsapp } from "react-icons/bs";
import { MapPin } from "lucide-react";
import Input from "./Input";
import { useDispatch } from "react-redux";
import { addEnquiry } from "../toolkit/slices/settingSlice";
import { useToast } from "./ToastProvider";

// --------------------
// ⭐ ZOD VALIDATION SCHEMA
// --------------------
const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  mobile: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(10, "Mobile number must be 10 digits"),
  city: z.string().min(1, "City is required"),
  location: z.string().min(1, "Location is required"),
  whatsappUpdates: z.boolean().optional(),
});

const EnquiryForm = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [locationValue, setLocationValue] = useState("");

  // --------------------
  // ⭐ React Hook Form
  // --------------------
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      city: "",
      location: "",
      whatsappUpdates: true,
    },
  });

  // --------------------
  // ⭐ GET USER LOCATION
  // --------------------
  const getLocation = () => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = `${pos.coords.latitude}, ${pos.coords.longitude}`;
        setLocationValue(loc);
        setValue("location", loc);
        setLoading(false);
      },
      () => {
        alert("Unable to fetch location.");
        setLoading(false);
      }
    );
  };

  // --------------------
  // ⭐ FORM SUBMIT
  // --------------------
  const onSubmit = (data) => {
    dispatch(addEnquiry())
      .then((resp) => {
        if (resp.meta.requestStatus === "fulfilled") {
          showToast({
            title: "Success!",
            description: "Enquiry has been added successfully !.",
            status: "success",
          });
          reset();
        } else {
          showToast({
            title: resp?.payload?.status,
            description: resp?.payload?.message,
            status: "error",
          });
        }
      })
      .catch(() => {
        showToast({
          title: "Something went wrong !.",
          description: "Failed to delete blog.",
          status: "error",
        });
      });
  };

  return (
    <form className="space-y-1 sm:space-y-2" onSubmit={handleSubmit(onSubmit)}>
      {/* NAME */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <>
            <Input {...field} type="text" placeholder="Your Name" />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </>
        )}
      />

      {/* EMAIL */}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <>
            <Input {...field} type="email" placeholder="Email Address" />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </>
        )}
      />

      {/* MOBILE */}
      <Controller
        name="mobile"
        control={control}
        render={({ field }) => (
          <>
            <Input {...field} type="text" placeholder="Mobile Number" />
            {errors.mobile && (
              <p className="text-red-500 text-sm">{errors.mobile.message}</p>
            )}
          </>
        )}
      />

      {/* STATE SELECT */}
      <Controller
        name="city"
        control={control}
        render={({ field }) => (
          <>
            <Input placeholder="Enter city" {...field} />

            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city.message}</p>
            )}
          </>
        )}
      />

      {/* LOCATION INPUT */}
      {/* <label className="block text-sm font-semibold">Your Location</label> */}

      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <>
            <div className="relative">
              <Input
                {...field}
                readOnly
                value={locationValue}
                placeholder="Click the icon to get your location"
              />

              <button
                type="button"
                onClick={getLocation}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 cursor-pointer"
              >
                {loading ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <MapPin size={20} />
                )}
              </button>
            </div>

            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location.message}</p>
            )}
          </>
        )}
      />

      {/* WHATSAPP UPDATES */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 text-xs sm:text-sm pt-1 sm:pt-2">
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <span className="text-gray-700">Get Update on</span>
          <BsWhatsapp color="green" className="w-4 h-4" />
          <span className="font-medium">WhatsApp</span>
        </div>

        <Controller
          name="whatsappUpdates"
          control={control}
          render={({ field }) => (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
              <div className="w-8 h-4 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-all"></div>
              <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transform peer-checked:translate-x-3.5 transition-all"></div>
            </label>
          )}
        />
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 mt-4 rounded-lg transition text-sm sm:text-base cursor-pointer"
      >
        Submit
      </button>
    </form>
  );
};

export default EnquiryForm;

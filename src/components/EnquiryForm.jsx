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

/* ---------------- ZOD SCHEMA ---------------- */
const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  mobile: z
    .string()
    .min(10, "Mobile number must be 10 digits")
    .max(10, "Mobile number must be 10 digits"),
  city: z.string().min(1, "City is required"),
  location: z.string().min(1, "Location is required"),
  message: z.string().min(5, "Message is required"),
  whatsappUpdates: z.boolean().optional(),
});

const EnquiryForm = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [locationValue, setLocationValue] = useState("");

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
      message: "",
      whatsappUpdates: true,
    },
  });

  /* -------- LOCATION -------- */
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

  /* -------- SUBMIT -------- */
  const onSubmit = (data) => {
    dispatch(addEnquiry(data))
      .then((resp) => {
        if (resp.meta.requestStatus === "fulfilled") {
          showToast({
            title: "Success!",
            description: "Enquiry submitted successfully.",
            status: "success",
          });
          reset();
          setLocationValue("");
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
          title: "Error",
          description: "Something went wrong.",
          status: "error",
        });
      });
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
      
      {/* NAME */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <>
            <Input {...field} placeholder="Your Name" className="h-9 text-sm px-3" />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </>
        )}
      />

      {/* EMAIL */}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <>
            <Input {...field} placeholder="Email Address" className="h-9 text-sm px-3" />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </>
        )}
      />

      {/* MOBILE */}
      <Controller
        name="mobile"
        control={control}
        render={({ field }) => (
          <>
            <Input {...field} placeholder="Mobile Number" className="h-9 text-sm px-3" />
            {errors.mobile && <p className="text-red-500 text-xs">{errors.mobile.message}</p>}
          </>
        )}
      />

      {/* CITY */}
      <Controller
        name="city"
        control={control}
        render={({ field }) => (
          <>
            <Input {...field} placeholder="City" className="h-9 text-sm px-3" />
            {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
          </>
        )}
      />

      {/* LOCATION */}
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
                placeholder="Get your location"
                className="h-9 text-sm px-3 pr-8"
              />
              <button
                type="button"
                onClick={getLocation}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 cursor-pointer"
              >
                {loading ? "⏳" : <MapPin size={16} />}
              </button>
            </div>
            {errors.location && (
              <p className="text-red-500 text-xs">{errors.location.message}</p>
            )}
          </>
        )}
      />

      {/* MESSAGE */}
      <Controller
        name="message"
        control={control}
        render={({ field }) => (
          <>
            <textarea
              {...field}
              placeholder="Your Message"
              rows={3}
              className="
                w-full
                rounded-md
                border
                border-gray-300
                px-3
                py-2
                text-sm
                resize-none
                outline-none
                focus:border-green-500
              "
            />
            {errors.message && (
              <p className="text-red-500 text-xs">{errors.message.message}</p>
            )}
          </>
        )}
      />

      {/* WHATSAPP */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center gap-1">
          <span>Get updates on</span>
          <BsWhatsapp className="text-green-600" size={14} />
          <span className="font-medium">WhatsApp</span>
        </div>

        <Controller
          name="whatsappUpdates"
          control={control}
          render={({ field }) => (
            <label className="relative inline-flex cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
              <div className="w-7 h-3.5 bg-gray-300 rounded-full peer-checked:bg-green-500" />
              <div className="absolute left-0.5 top-0.5 w-2.5 h-2.5 bg-white rounded-full peer-checked:translate-x-3 transition-all" />
            </label>
          )}
        />
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        className="
          w-full
          bg-green-600
          hover:bg-green-700
          text-white
          font-semibold
          py-2
          mt-3
          rounded-md
          text-sm
          cursor-pointer
        "
      >
        Submit
      </button>
    </form>
  );
};

export default EnquiryForm;

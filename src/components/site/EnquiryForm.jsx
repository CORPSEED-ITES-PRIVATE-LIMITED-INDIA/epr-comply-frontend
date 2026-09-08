"use client";

import { Controller, useForm } from "react-hook-form";
import { WhatsappIcon } from "@/components/ui/icons";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";
import {
  MOBILE_LENGTH,
  createEnquiryResolver,
  digitsOnly,
  submitEnquiry,
} from "@/lib/enquiry";

const resolver = createEnquiryResolver();

/**
 * The mobile field accepts digits only - anything else is dropped as it is
 * typed or pasted, and input stops at the length the backend expects.
 */
const handleMobileChange = (field) => (event) =>
  field.onChange(digitsOnly(event.target.value));

const EnquiryForm = () => {
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver,
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      message: "",
      whatsappUpdates: true,
    },
  });

  const onSubmit = async (data) => {
    try {
      await submitEnquiry(data);

      showToast({
        title: "Success!",
        description: "Enquiry submitted successfully.",
        status: "success",
      });
      reset();
    } catch (error) {
      showToast({
        title: "Error",
        description: error?.message || "Something went wrong.",
        status: "error",
      });
    }
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
      {/* NAME */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <>
            <Input
              {...field}
              placeholder="Your Name"
              autoComplete="name"
              className="h-9 text-sm px-3"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
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
            <Input
              {...field}
              placeholder="Email Address"
              type="email"
              autoComplete="email"
              className="h-9 text-sm px-3"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
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
            <Input
              {...field}
              onChange={handleMobileChange(field)}
              placeholder="Mobile Number"
              type="text"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={MOBILE_LENGTH}
              className="h-9 text-sm px-3"
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs">{errors.mobile.message}</p>
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
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none outline-none focus:border-green-500"
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
          <WhatsappIcon className="text-green-600" size={14} />
          <span className="font-medium">WhatsApp</span>
        </div>

        <Controller
          name="whatsappUpdates"
          control={control}
          render={({ field }) => (
            <label className="relative inline-flex cursor-pointer">
              <span className="sr-only">Get updates on WhatsApp</span>
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
        disabled={isSubmitting}
        className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 mt-3 rounded-md text-sm cursor-pointer disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default EnquiryForm;

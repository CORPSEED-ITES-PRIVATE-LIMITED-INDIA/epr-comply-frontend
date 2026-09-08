"use client";

import { Controller, useForm } from "react-hook-form";
import { useToast } from "@/components/ui/ToastProvider";
import {
  MOBILE_LENGTH,
  createEnquiryResolver,
  digitsOnly,
  submitEnquiry,
} from "@/lib/enquiry";

const resolver = createEnquiryResolver();

const field =
  "p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none";

/**
 * Contact page enquiry form.
 *
 * The Vite version rendered these inputs with no submit handler, so the form
 * silently discarded every lead. It now posts to the same `/api/enquiries`
 * endpoint the sidebar form uses, with the subject folded into the message so
 * no backend change is required.
 */
const ContactForm = () => {
  const { showToast } = useToast();

  const {
    register,
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
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await submitEnquiry({
        name: values.name,
        email: values.email,
        mobile: values.mobile,
        message: values.subject
          ? `[${values.subject}] ${values.message}`
          : values.message,
        whatsappUpdates: true,
      });

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
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="Your Name"
          autoComplete="name"
          className={field}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <input
          type="email"
          placeholder="Your Email"
          autoComplete="email"
          className={field}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {/* Controlled, unlike the other fields: filtering an uncontrolled
            input means writing the cleaned value back with setValue, which
            resets the caret to position 0 and scrambles what you type. */}
        <Controller
          name="mobile"
          control={control}
          render={({ field: mobileField }) => (
            <input
              {...mobileField}
              onChange={(event) =>
                mobileField.onChange(digitsOnly(event.target.value))
              }
              type="text"
              placeholder="Phone Number"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={MOBILE_LENGTH}
              className={field}
            />
          )}
        />
        {errors.mobile && (
          <p className="text-red-500 text-xs">{errors.mobile.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="Subject"
          className={field}
          {...register("subject")}
        />
      </div>

      <div className="md:col-span-2 flex flex-col gap-1">
        <textarea
          rows={5}
          placeholder="Your Message"
          className={field}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-red-500 text-xs">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="md:col-span-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition cursor-pointer disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit Enquiry"}
      </button>
    </form>
  );
};

export default ContactForm;

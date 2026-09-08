/**
 * Validation + submission for the two public enquiry forms.
 *
 * These forms used a zod schema through @hookform/resolvers, which put ~89 KB
 * (gzipped) of schema runtime into every marketing page for four fields. The
 * checks below are the same rules with the same messages, wired up as a plain
 * react-hook-form resolver, and the POST goes through `fetch` so axios stays
 * out of the public bundle too.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MOBILE_LENGTH = 10;

/**
 * Keeps digits only, capped at the length the backend expects. Used as the
 * mobile field's onChange so letters, spaces and punctuation can never be
 * typed or pasted in.
 */
export const digitsOnly = (value = "") =>
  String(value)
    .replace(/[^0-9]/g, "")
    .slice(0, MOBILE_LENGTH);

const RULES = {
  name: (value) => (String(value ?? "").trim().length < 2 ? "Name is required" : null),
  email: (value) => (EMAIL_RE.test(String(value ?? "").trim()) ? null : "Invalid email"),
  mobile: (value) =>
    String(value ?? "").trim().length === MOBILE_LENGTH
      ? null
      : `Mobile number must be ${MOBILE_LENGTH} digits`,
  message: (value) =>
    String(value ?? "").trim().length < 5 ? "Message is required" : null,
};

/**
 * react-hook-form resolver. `fields` lists which rules apply, so the contact
 * page can share the same logic while adding its optional subject field.
 */
export const createEnquiryResolver =
  (fields = ["name", "email", "mobile", "message"]) =>
  async (values) => {
    const errors = {};

    for (const field of fields) {
      const message = RULES[field]?.(values[field]);
      if (message) errors[field] = { type: "validate", message };
    }

    return Object.keys(errors).length > 0
      ? { values: {}, errors }
      : { values, errors: {} };
  };

/** Posts an enquiry. Resolves on success, throws with a usable message. */
export async function submitEnquiry(payload) {
  const res = await fetch("/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "Something went wrong.";
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      /* non-JSON error body - keep the generic message */
    }
    throw new Error(message);
  }

  return res.status === 204 ? null : res.json().catch(() => null);
}

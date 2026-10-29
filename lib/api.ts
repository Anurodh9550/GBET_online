export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export const ADMIN_TOKEN_KEY = "gbet-online-admin-token";

export type EnquiryStatus = "new" | "called" | "closed";
export type EnquirySource = "website" | "brochure";

export type Enquiry = {
  id: number;
  full_name: string;
  mobile: string;
  email: string;
  state: string;
  city: string;
  course: string;
  message: string;
  source: EnquirySource;
  status: EnquiryStatus;
  note: string;
  created_at: string;
  updated_at: string;
};

export type EnquiryInput = {
  full_name: string;
  mobile: string;
  email: string;
  state: string;
  city: string;
  course: string;
  message?: string;
  source: EnquirySource;
};

export function createEnquiry(input: EnquiryInput) {
  return fetch(`${API_URL}/api/enquiries/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function adminHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  };
}

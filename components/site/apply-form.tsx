"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, useState, type ReactNode } from "react";
import {
  Field,
  Notice,
  SelectInput,
  SubmitButton,
  TextInput,
} from "@/components/portal/form-controls";
import {
  RequestSuccess,
  sendRequest,
  validatePerson,
} from "@/components/site/request-kit";
import { CATALOG, getCatalogCourse } from "@/lib/course-catalog";
import { INDIAN_STATES, SITE } from "@/lib/site";

const QUALIFICATIONS = [
  "Class 10",
  "Class 12",
  "Diploma",
  "Graduate",
  "Postgraduate",
  "Other",
];
const START_OPTIONS = [
  "Next available batch",
  "Within 1 month",
  "In 1–3 months",
  "Not sure yet",
];

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
      <legend className="mb-1 text-sm font-bold tracking-wide text-azure uppercase sm:col-span-2">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

export function ApplyForm() {
  const params = useSearchParams();
  const preset = getCatalogCourse(params.get("course") ?? "")?.title ?? "";
  const [form, setForm] = useState({
    name: "",
    dob: "",
    mobile: "",
    email: "",
    state: "Uttar Pradesh",
    city: "",
    course: preset,
    qualification: "Class 12",
    board: "",
    year: "",
    marks: "",
    start: START_OPTIONS[0],
    working: "No",
    message: "",
    consent: false,
  });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const set =
    (key: keyof typeof form) => (event: { target: { value: string } }) =>
      setForm({ ...form, [key]: event.target.value });

  async function submit(event: FormEvent) {
    event.preventDefault();
    const year = Number(form.year);
    const problem =
      validatePerson(form) ||
      (!form.course ? "Choose the course you are applying for." : "") ||
      (form.year && (year < 1970 || year > new Date().getFullYear() + 1)
        ? "Enter a valid year of passing."
        : "") ||
      (!form.consent ? "Please confirm that the details are correct." : "");
    if (problem) {
      setError(problem);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSending(true);
    setError("");
    try {
      await sendRequest("application", form, [
        ["Date of birth", form.dob],
        ["Highest qualification", form.qualification],
        ["Board / university", form.board],
        ["Year of passing", form.year],
        ["Marks / grade", form.marks],
        ["Preferred start", form.start],
        ["Currently working", form.working],
        ["Message", form.message],
      ]);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The application could not be sent.",
      );
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <RequestSuccess title="Application received">
        Thank you, {form.name.split(" ")[0]}. Your application for the{" "}
        {form.course} has been sent to the admissions team. An advisor will call{" "}
        {form.mobile} for counselling and document verification. Questions? Call{" "}
        {SITE.phone}.
      </RequestSuccess>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="grid gap-6 rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <h2 className="text-xl font-bold">Application form</h2>
        <p className="mt-1 text-sm text-ink-soft">
          It takes about 3 minutes. No payment is taken on this form.
        </p>
      </div>
      {error ? <Notice tone="error">{error}</Notice> : null}

      <Group title="Course">
        <Field
          id="ap-course"
          label="Course you are applying for"
          className="sm:col-span-2"
        >
          <SelectInput
            id="ap-course"
            value={form.course}
            onChange={set("course")}
          >
            <option value="">Choose a course</option>
            {CATALOG.map((course) => (
              <option key={course.slug}>{course.title}</option>
            ))}
          </SelectInput>
        </Field>
        <Field id="ap-start" label="When would you like to start?">
          <SelectInput id="ap-start" value={form.start} onChange={set("start")}>
            {START_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </SelectInput>
        </Field>
        <Field id="ap-working" label="Are you currently working?">
          <SelectInput
            id="ap-working"
            value={form.working}
            onChange={set("working")}
          >
            <option>No</option>
            <option>Yes</option>
          </SelectInput>
        </Field>
      </Group>

      <Group title="Personal details">
        <Field
          id="ap-name"
          label="Full name (as on marksheet)"
          className="sm:col-span-2"
        >
          <TextInput
            id="ap-name"
            autoComplete="name"
            value={form.name}
            onChange={set("name")}
          />
        </Field>
        <Field id="ap-dob" label="Date of birth" optional>
          <TextInput
            id="ap-dob"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            value={form.dob}
            onChange={set("dob")}
          />
        </Field>
        <Field id="ap-mobile" label="Mobile number">
          <TextInput
            id="ap-mobile"
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel-national"
            value={form.mobile}
            onChange={(event) =>
              setForm({
                ...form,
                mobile: event.target.value.replace(/\D/g, "").slice(0, 10),
              })
            }
          />
        </Field>
        <Field id="ap-email" label="Email">
          <TextInput
            id="ap-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={set("email")}
          />
        </Field>
        <Field id="ap-state" label="State">
          <SelectInput id="ap-state" value={form.state} onChange={set("state")}>
            {INDIAN_STATES.map((state) => (
              <option key={state}>{state}</option>
            ))}
          </SelectInput>
        </Field>
        <Field id="ap-city" label="City" className="sm:col-span-2">
          <TextInput
            id="ap-city"
            autoComplete="address-level2"
            value={form.city}
            onChange={set("city")}
          />
        </Field>
      </Group>

      <Group title="Education">
        <Field id="ap-qual" label="Highest qualification">
          <SelectInput
            id="ap-qual"
            value={form.qualification}
            onChange={set("qualification")}
          >
            {QUALIFICATIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </SelectInput>
        </Field>
        <Field id="ap-board" label="Board / university" optional>
          <TextInput id="ap-board" value={form.board} onChange={set("board")} />
        </Field>
        <Field id="ap-year" label="Year of passing" optional>
          <TextInput
            id="ap-year"
            inputMode="numeric"
            maxLength={4}
            value={form.year}
            onChange={(event) =>
              setForm({
                ...form,
                year: event.target.value.replace(/\D/g, "").slice(0, 4),
              })
            }
          />
        </Field>
        <Field
          id="ap-marks"
          label="Marks / grade"
          optional
          hint="e.g. 78% or 7.8 CGPA"
        >
          <TextInput id="ap-marks" value={form.marks} onChange={set("marks")} />
        </Field>
      </Group>

      <Group title="Anything else">
        <Field
          id="ap-message"
          label="Questions or notes for the admissions team"
          optional
          className="sm:col-span-2"
        >
          <textarea
            id="ap-message"
            rows={3}
            maxLength={500}
            value={form.message}
            onChange={set("message")}
            className="w-full rounded-xl border border-line px-3.5 py-3 text-sm outline-none focus:border-azure focus:ring-4 focus:ring-azure/15"
          />
        </Field>
        <label className="flex items-start gap-3 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(event) =>
              setForm({ ...form, consent: event.target.checked })
            }
            className="mt-0.5 size-4 accent-[var(--color-azure)]"
          />
          <span>
            I confirm these details are correct and agree to be contacted by the
            GBET admissions team about my application.
          </span>
        </label>
      </Group>

      <SubmitButton pending={sending}>
        {sending ? "Submitting…" : "Submit application"}
      </SubmitButton>
    </form>
  );
}

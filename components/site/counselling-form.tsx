"use client";

import { FormEvent, useState } from "react";
import { MapPin, MessageCircle, Phone } from "lucide-react";
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
import { CATALOG } from "@/lib/course-catalog";
import { CAMPUSES, INDIAN_STATES } from "@/lib/site";
import { cn } from "@/lib/utils";

const SLOTS = [
  "10:00 am – 12:00 pm",
  "12:00 pm – 3:00 pm",
  "3:00 pm – 6:00 pm",
];
const MODES = [
  { id: "Phone call", icon: Phone, text: "We call your mobile" },
  { id: "WhatsApp video", icon: MessageCircle, text: "Video call on WhatsApp" },
  { id: "Office visit", icon: MapPin, text: CAMPUSES[0].address },
];

function isoDate(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

export function CounsellingForm() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    state: "Uttar Pradesh",
    city: "",
    course: "",
    date: isoDate(1),
    slot: SLOTS[0],
    mode: MODES[0].id,
    question: "",
  });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const set =
    (key: keyof typeof form) => (event: { target: { value: string } }) =>
      setForm({ ...form, [key]: event.target.value });

  async function submit(event: FormEvent) {
    event.preventDefault();
    const day = new Date(`${form.date}T00:00:00`);
    const problem =
      validatePerson(form) ||
      (!form.date || form.date < isoDate(0) || form.date > isoDate(30)
        ? "Choose a date within the next 30 days."
        : "") ||
      (day.getDay() === 0
        ? "The admissions desk is closed on Sundays. Please choose another day."
        : "");
    if (problem) return setError(problem);
    setSending(true);
    setError("");
    try {
      await sendRequest("counselling", form, [
        [
          "Preferred date",
          day.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        ],
        ["Preferred time", form.slot],
        ["Mode", form.mode],
        ["Question", form.question],
      ]);
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "The booking could not be sent.",
      );
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <RequestSuccess title="Counselling request received">
        We have noted {form.mode.toLowerCase()} on{" "}
        {new Date(`${form.date}T00:00:00`).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
        })}
        , {form.slot}. The admissions team will call {form.mobile} to confirm
        the slot.
      </RequestSuccess>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="grid gap-4 rounded-3xl border border-line bg-white p-6 shadow-sm sm:grid-cols-2 sm:p-7"
    >
      <div className="sm:col-span-2">
        <h2 className="text-xl font-bold">Book your free session</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Pick a time that suits you. We confirm the slot by phone.
        </p>
      </div>
      {error ? (
        <Notice tone="error" className="sm:col-span-2">
          {error}
        </Notice>
      ) : null}
      <fieldset className="sm:col-span-2">
        <legend className="text-sm font-semibold">
          How would you like to talk?
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {MODES.map(({ id, icon: Icon, text }) => (
            <label
              key={id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition",
                form.mode === id
                  ? "border-azure bg-azure-soft"
                  : "border-line hover:border-azure",
              )}
            >
              <input
                type="radio"
                name="mode"
                value={id}
                checked={form.mode === id}
                onChange={set("mode")}
                className="sr-only"
              />
              <Icon className="mt-0.5 size-4 shrink-0 text-azure" aria-hidden />
              <span>
                <span className="block font-semibold">{id}</span>
                <span className="text-xs text-ink-soft">{text}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <Field id="cs-date" label="Preferred date" hint="Monday to Saturday">
        <TextInput
          id="cs-date"
          type="date"
          min={isoDate(0)}
          max={isoDate(30)}
          value={form.date}
          onChange={set("date")}
        />
      </Field>
      <Field id="cs-slot" label="Preferred time">
        <SelectInput id="cs-slot" value={form.slot} onChange={set("slot")}>
          {SLOTS.map((slot) => (
            <option key={slot}>{slot}</option>
          ))}
        </SelectInput>
      </Field>
      <Field id="cs-name" label="Full name" className="sm:col-span-2">
        <TextInput
          id="cs-name"
          autoComplete="name"
          value={form.name}
          onChange={set("name")}
        />
      </Field>
      <Field id="cs-mobile" label="Mobile number">
        <TextInput
          id="cs-mobile"
          inputMode="numeric"
          maxLength={10}
          value={form.mobile}
          onChange={(event) =>
            setForm({
              ...form,
              mobile: event.target.value.replace(/\D/g, "").slice(0, 10),
            })
          }
        />
      </Field>
      <Field id="cs-email" label="Email">
        <TextInput
          id="cs-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={set("email")}
        />
      </Field>
      <Field id="cs-state" label="State">
        <SelectInput id="cs-state" value={form.state} onChange={set("state")}>
          {INDIAN_STATES.map((state) => (
            <option key={state}>{state}</option>
          ))}
        </SelectInput>
      </Field>
      <Field id="cs-city" label="City">
        <TextInput id="cs-city" value={form.city} onChange={set("city")} />
      </Field>
      <Field
        id="cs-course"
        label="Course you are interested in"
        optional
        className="sm:col-span-2"
      >
        <SelectInput
          id="cs-course"
          value={form.course}
          onChange={set("course")}
        >
          <option value="">Not sure yet – help me choose</option>
          {CATALOG.map((course) => (
            <option key={course.slug}>{course.title}</option>
          ))}
        </SelectInput>
      </Field>
      <Field
        id="cs-question"
        label="What would you like to discuss?"
        optional
        className="sm:col-span-2"
      >
        <TextInput
          id="cs-question"
          maxLength={300}
          value={form.question}
          onChange={set("question")}
          placeholder="e.g. eligibility, fees, batch timing, career options"
        />
      </Field>
      <SubmitButton pending={sending} className="sm:col-span-2">
        {sending ? "Booking…" : "Book free counselling"}
      </SubmitButton>
    </form>
  );
}

"use client";

import { FormEvent, useState } from "react";
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
import { SCHOLARSHIPS } from "@/lib/content";
import { INDIAN_STATES } from "@/lib/site";

export function ScholarshipForm() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    state: "Uttar Pradesh",
    city: "",
    course: "",
    scholarship: SCHOLARSHIPS[0].title as string,
    qualification: "",
    note: "",
  });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const problem =
      validatePerson(form) ||
      (!form.course ? "Choose the course you want to join." : "");
    if (problem) return setError(problem);
    setSending(true);
    setError("");
    try {
      await sendRequest("scholarship", form, [
        ["Scholarship", form.scholarship],
        ["Highest qualification / marks", form.qualification],
        ["Note", form.note],
      ]);
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "The request could not be sent.",
      );
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <RequestSuccess title="Scholarship request received">
        The admissions team will call you to check eligibility for the{" "}
        {form.scholarship} and tell you which documents to share. Keep the
        documents listed for your category ready.
      </RequestSuccess>
    );
  }

  const set =
    (key: keyof typeof form) => (event: { target: { value: string } }) =>
      setForm({ ...form, [key]: event.target.value });

  return (
    <form
      id="apply-scholarship"
      onSubmit={submit}
      noValidate
      className="grid gap-4 rounded-3xl border border-line bg-white p-6 shadow-sm sm:grid-cols-2 sm:p-7"
    >
      <div className="sm:col-span-2">
        <h2 className="text-xl font-bold">Request a scholarship check</h2>
        <p className="mt-1 text-sm text-ink-soft">
          The admissions team checks your eligibility and confirms any
          concession before admission.
        </p>
      </div>
      {error ? (
        <Notice tone="error" className="sm:col-span-2">
          {error}
        </Notice>
      ) : null}
      <Field id="sch-name" label="Full name" className="sm:col-span-2">
        <TextInput
          id="sch-name"
          autoComplete="name"
          value={form.name}
          onChange={set("name")}
        />
      </Field>
      <Field id="sch-mobile" label="Mobile number">
        <TextInput
          id="sch-mobile"
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
      <Field id="sch-email" label="Email">
        <TextInput
          id="sch-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={set("email")}
        />
      </Field>
      <Field id="sch-state" label="State">
        <SelectInput id="sch-state" value={form.state} onChange={set("state")}>
          {INDIAN_STATES.map((state) => (
            <option key={state}>{state}</option>
          ))}
        </SelectInput>
      </Field>
      <Field id="sch-city" label="City">
        <TextInput id="sch-city" value={form.city} onChange={set("city")} />
      </Field>
      <Field id="sch-type" label="Scholarship category">
        <SelectInput
          id="sch-type"
          value={form.scholarship}
          onChange={set("scholarship")}
        >
          {SCHOLARSHIPS.map((item) => (
            <option key={item.slug}>{item.title}</option>
          ))}
        </SelectInput>
      </Field>
      <Field id="sch-course" label="Course">
        <SelectInput
          id="sch-course"
          value={form.course}
          onChange={set("course")}
        >
          <option value="">Choose a course</option>
          {CATALOG.map((course) => (
            <option key={course.slug}>{course.title}</option>
          ))}
        </SelectInput>
      </Field>
      <Field
        id="sch-qual"
        label="Highest qualification and marks"
        optional
        className="sm:col-span-2"
        hint="e.g. Class 12, 82% (CBSE, 2026)"
      >
        <TextInput
          id="sch-qual"
          value={form.qualification}
          onChange={set("qualification")}
        />
      </Field>
      <Field
        id="sch-note"
        label="Anything else we should know"
        optional
        className="sm:col-span-2"
      >
        <TextInput
          id="sch-note"
          value={form.note}
          onChange={set("note")}
          maxLength={300}
        />
      </Field>
      <SubmitButton pending={sending} className="sm:col-span-2">
        {sending ? "Sending…" : "Send request"}
      </SubmitButton>
    </form>
  );
}

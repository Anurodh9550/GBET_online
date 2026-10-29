"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COURSES } from "@/lib/courses";
import { SITE } from "@/lib/site";
import { toast } from "sonner";
import { Reveal } from "@/components/shared/reveal";

export default function BrochurePage() {
  const [unlocked, setUnlocked] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (window.sessionStorage.getItem("gbet-brochure-unlocked") === "1") setUnlocked(true);
  }, []);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: name,
        mobile: phone,
        email,
        state: "Uttar Pradesh",
        city: "Noida",
        course: "Brochure download",
        message: "Requested 2027 brochure",
      }),
    });
    if (!res.ok) {
      toast.error("Enter a valid name, 10-digit mobile and email.");
      return;
    }
    setUnlocked(true);
    toast.success("Brochure unlocked. You can print or save as PDF.");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-navy">Download Brochure</h1>
      <p className="mt-2 text-slate-600">Unlock the 2027 prospectus after a short enquiry (CRM + email ready).</p>
      {!unlocked ? (
        <form onSubmit={onSubmit} className="mt-8 grid gap-4 rounded-2xl border p-6">
          <div className="grid gap-1.5">
            <Label htmlFor="b-name">Full name</Label>
            <Input id="b-name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="b-phone">Mobile</Label>
            <Input id="b-phone" required pattern="[6-9][0-9]{9}" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="b-email">Email</Label>
            <Input id="b-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" className="h-11">Unlock brochure</Button>
        </form>
      ) : (
        <Reveal>
        <article className="mt-8 rounded-2xl border p-8 print:border-0">
          <p className="text-sm font-semibold tracking-wide text-brand uppercase">{SITE.fullName}</p>
          <h2 className="mt-2 text-2xl font-bold">Admissions Open 2027</h2>
          <p className="mt-2">{SITE.tagline}</p>
          <h3 className="mt-6 font-semibold">Programmes</h3>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {COURSES.map((c) => (
              <li key={c.slug}>{c.name} — {c.duration} — {c.seats} seats — {c.eligibility}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm">{SITE.phone} · {SITE.email}</p>
          <p className="text-sm">C-77, Sector 63A, Noida, Uttar Pradesh</p>
          <Button type="button" className="mt-6 h-11 print:hidden" onClick={() => window.print()}>
            Print / Save PDF
          </Button>
        </article>
        </Reveal>
      )}
    </div>
  );
}

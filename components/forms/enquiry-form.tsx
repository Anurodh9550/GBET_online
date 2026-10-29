"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/shared/section-heading";
import { useI18n } from "@/components/providers/language-provider";
import { COURSES } from "@/lib/courses";
import { INDIAN_STATES } from "@/lib/site";
import { createEnquiry } from "@/lib/api";
import { enquiryWhatsappMessage, whatsappLink } from "@/lib/whatsapp";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

const schema = z.object({
  fullName: z.string().min(2),
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  email: z.string().email(),
  state: z.string().min(2),
  city: z.string().min(2),
  course: z.string().min(1),
  message: z.string().optional(),
});

type EnquiryValues = z.infer<typeof schema>;

export function EnquiryForm({ compact = false, defaultCourse }: { compact?: boolean; defaultCourse?: string }) {
  const { t, locale } = useI18n();
  const form = useForm<EnquiryValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      mobile: "",
      email: "",
      state: "Uttar Pradesh",
      city: "",
      course: defaultCourse ?? COURSES[0].name,
      message: "",
    },
  });

  async function onSubmit(values: EnquiryValues) {
    const res = await createEnquiry({
      full_name: values.fullName,
      mobile: values.mobile,
      email: values.email,
      state: values.state,
      city: values.city,
      course: values.course,
      message: values.message ?? "",
      source: "website",
    });
    if (!res.ok) {
      toast.error("Could not send enquiry. Please check the form.");
      return;
    }
    toast.success(t.enquiry.success);
    window.open(whatsappLink(enquiryWhatsappMessage(values)), "_blank");
    form.reset();
  }

  const fieldClass = "h-11 w-full min-w-0";

  return (
    <Reveal as="section" hover={false} amount={0.18} id="enquiry" className={compact ? "" : "py-16 sm:py-20"}>
      <div className={compact ? "" : "mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2"}>
        {!compact ? (
          <div>
            <SectionHeading className="text-left mx-0" title={t.enquiry.title} subtitle={t.enquiry.subtitle} eyebrow="Lead desk" />
            <ul className="mt-8 space-y-3 text-sm text-slate-600">
              <li>WhatsApp API handoff to +91 9355470710</li>
              <li>Email notification to admission@gbedutrust.com</li>
              <li>CRM-ready JSON payload stored for the admissions desk</li>
            </ul>
          </div>
        ) : null}
        <Reveal className={compact ? "w-full" : undefined}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid min-w-0 gap-4 rounded-2xl border bg-white p-6 shadow-sm", compact && "w-full p-5 sm:p-6")}>
          {compact ? <h2 className="text-xl font-bold text-navy">{t.enquiry.title}</h2> : null}
          <div className="grid min-w-0 gap-1.5">
            <Label htmlFor="fullName">{t.enquiry.name}</Label>
            <Input id="fullName" className={fieldClass} autoComplete="name" {...form.register("fullName")} />
            {form.formState.errors.fullName ? <p className="text-xs text-destructive">Enter your full name.</p> : null}
          </div>
          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <div className="grid min-w-0 gap-1.5">
              <Label htmlFor="mobile">{t.enquiry.mobile}</Label>
              <Input id="mobile" className={fieldClass} inputMode="numeric" autoComplete="tel" {...form.register("mobile")} />
              {form.formState.errors.mobile ? <p className="text-xs text-destructive">Enter a 10-digit mobile number.</p> : null}
            </div>
            <div className="grid min-w-0 gap-1.5">
              <Label htmlFor="email">{t.enquiry.email}</Label>
              <Input id="email" type="email" className={fieldClass} autoComplete="email" {...form.register("email")} />
              {form.formState.errors.email ? <p className="text-xs text-destructive">Enter a valid email.</p> : null}
            </div>
          </div>
          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <div className="grid min-w-0 gap-1.5">
              <Label htmlFor="state">{t.enquiry.state}</Label>
              <select id="state" className="h-11 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-sm" {...form.register("state")}>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="grid min-w-0 gap-1.5">
              <Label htmlFor="city">{t.enquiry.city}</Label>
              <Input id="city" className={fieldClass} placeholder={locale === "hi" ? "शहर" : "City"} {...form.register("city")} />
            </div>
          </div>
          <div className="grid min-w-0 gap-1.5">
            <Label htmlFor="course">{t.enquiry.course}</Label>
            <select id="course" className="h-11 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-sm" {...form.register("course")}>
              {COURSES.map((c) => (
                <option key={c.slug} value={c.name}>{locale === "hi" ? c.nameHi : c.name}</option>
              ))}
            </select>
          </div>
          <div className="grid min-w-0 gap-1.5">
            <Label htmlFor="message">{t.enquiry.message}</Label>
            <Textarea id="message" rows={4} className="w-full min-w-0" {...form.register("message")} />
          </div>
          <Button type="submit" className={cn("h-12", compact && "w-full")} disabled={form.formState.isSubmitting}>
            {t.enquiry.submit}
          </Button>
        </form>
        </Reveal>
      </div>
    </Reveal>
  );
}

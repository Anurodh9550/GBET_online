import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  ClipboardCheck,
  FileText,
  FolderOpen,
  IndianRupee,
  LayoutDashboard,
  LifeBuoy,
  PlayCircle,
  ScrollText,
  UserRound,
  Video,
  type LucideIcon,
} from "lucide-react";

export type PortalSection = {
  slug: string;
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  ready: boolean;
};

export const PORTAL_SECTIONS: PortalSection[] = [
  {
    slug: "",
    href: "/student",
    label: "Overview",
    icon: LayoutDashboard,
    description: "Your learning summary.",
    ready: true,
  },
  {
    slug: "courses",
    href: "/student/courses",
    label: "My Courses",
    icon: BookOpen,
    description:
      "Courses assigned to you by the academic team, with progress and a Continue Learning button.",
    ready: true,
  },
  {
    slug: "progress",
    href: "/student/progress",
    label: "Course Progress",
    icon: BarChart3,
    description: "Module and lesson completion for each of your courses.",
    ready: true,
  },
  {
    slug: "lectures",
    href: "/student/lectures",
    label: "Video Lectures",
    icon: PlayCircle,
    description: "Recorded lessons for your courses, module by module.",
    ready: true,
  },
  {
    slug: "live-classes",
    href: "/student/live-classes",
    label: "Live Classes",
    icon: Video,
    description:
      "Upcoming live sessions for your batch, with join links and past recordings.",
    ready: false,
  },
  {
    slug: "materials",
    href: "/student/materials",
    label: "Study Materials",
    icon: FolderOpen,
    description: "Notes and downloadable resources for each module.",
    ready: true,
  },
  {
    slug: "assignments",
    href: "/student/assignments",
    label: "Assignments",
    icon: FileText,
    description:
      "Assignment briefs, deadlines, submissions, feedback and marks.",
    ready: false,
  },
  {
    slug: "exams",
    href: "/student/exams",
    label: "Examinations",
    icon: ClipboardCheck,
    description: "Scheduled online examinations for your courses.",
    ready: false,
  },
  {
    slug: "results",
    href: "/student/results",
    label: "Results",
    icon: ScrollText,
    description: "Released examination results with marks and status.",
    ready: false,
  },
  {
    slug: "certificates",
    href: "/student/certificates",
    label: "Certificates",
    icon: Award,
    description: "Approved course certificates, ready to download and verify.",
    ready: false,
  },
  {
    slug: "fees",
    href: "/student/fees",
    label: "Fees & Payments",
    icon: IndianRupee,
    description: "Course fees, installments, online payment and receipts.",
    ready: true,
  },
  {
    slug: "notifications",
    href: "/student/notifications",
    label: "Notifications",
    icon: Bell,
    description:
      "Announcements and reminders from your faculty and the academic team.",
    ready: false,
  },
  {
    slug: "profile",
    href: "/student/profile",
    label: "My Profile",
    icon: UserRound,
    description: "Your details and password.",
    ready: true,
  },
  {
    slug: "help",
    href: "/student/help",
    label: "Help & Support",
    icon: LifeBuoy,
    description: "Contact the GBET team.",
    ready: true,
  },
];

export const UPCOMING_SECTIONS = PORTAL_SECTIONS.filter(
  (section) => !section.ready,
);

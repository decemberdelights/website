"use client";

import {
  MapPin,
  Phone,
  User,
  Mail,
  Briefcase,
  FileText,
  Upload,
  MessageSquare,
  Clock,
  Coffee,
  Heart,
  Users,
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  Shield,
  BarChart2,
  Compass,
  Star,
  ChevronRight,
} from "lucide-react";

export {
  MapPin,
  Phone,
  User,
  Mail,
  Briefcase,
  FileText,
  Upload,
  MessageSquare,
  Clock,
  Coffee,
  Heart,
  Users,
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  Shield,
  BarChart2,
  Compass,
  Star,
  ChevronRight,
};

export function Instagram({ size = 18, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function Rupee({ size = 18, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="7" y1="4" x2="17" y2="4" />
      <line x1="7" y1="8" x2="17" y2="8" />
      <path d="M7 12c0 2.21 2.69 4 6 4s6-1.79 6-4" />
      <line x1="7" y1="16" x2="17" y2="16" />
    </svg>
  );
}

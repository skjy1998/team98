"use client";

import DashboardView from "@/components/dashboard/DashboardView";
import { demoDashboardData } from "@/lib/demo/demo-dashboard-data";

export default function DemoDashboardPage() {
  return <DashboardView data={demoDashboardData} />;
}

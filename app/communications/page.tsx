import type { Metadata } from "next";
import { CommunicationsConsole } from "@/components/comms/CommunicationsConsole";
export const metadata: Metadata = { title: "ARTEMIS Communications Hub | Preview", robots: { index: false, follow: false } };
export default function Page() { return <CommunicationsConsole />; }

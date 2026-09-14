import { getEvents } from "@/lib/services/events";
import { EventManager } from "@/components/admin/EventManager";

export const metadata = {
  title: "Kelola Event & Agenda",
  description: "Kelola agenda kegiatan dan arsip event HIMA STIE 66 Kendari.",
};

export default async function AdminEventPage() {
  const events = await getEvents();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#1F2937]">
          Kelola Event & Kegiatan
        </h1>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Tambah agenda acara mendatang dan kelola riwayat kegiatan lampau.
        </p>
      </div>

      <EventManager initialEvents={events} />
    </div>
  );
}

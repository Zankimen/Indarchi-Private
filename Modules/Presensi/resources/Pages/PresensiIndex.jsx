"use client";

import React, { useState, useMemo, useEffect } from "react";
import Navbar from "@/layout/NavBar";
import { usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

function formatTime(time) {
  if (!time) return "";
  return time.slice(0, 5);
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
function formatKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const pekerjaDummy = [
  { nama: "Pak Budi", posisi: "Mandor", status: "Hadir" },
  { nama: "Pak Andi", posisi: "Kuli", status: "Hadir" },
  { nama: "Bu Siti", posisi: "Admin", status: "Izin" },
];

function PresensiIndex() {
  const { props } = usePage();
  const projectId = props.projectId;

  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [attendance, setAttendance] = useState({});
  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedPresensi, setSelectedPresensi] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [type, setType] = useState("Biasa");

  const start = startOfMonth(cursor);
  const end = endOfMonth(cursor);
  const daysInMonth = end.getDate();
  const startWeekday = start.getDay();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ date: null, key: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(cursor.getFullYear(), cursor.getMonth(), d);
    cells.push({ date, key: formatKey(date) });
  }
  while (cells.length % 7 !== 0) cells.push({ date: null, key: null });

  // 🔄 Fetch data attendance
  useEffect(() => {
    async function fetchAttendances() {
      try {
        const res = await fetch(`/projects/${projectId}/attendances`, {
          credentials: "same-origin",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal ambil data.");

        const grouped = data.reduce((acc, item) => {
          const key = item.date;
          if (!acc[key]) acc[key] = [];
          acc[key].push({
            id: item.id,
            type: item.type,
            start: item.start_time,
            end: item.end_time,
          });
          return acc;
        }, {});
        setAttendance(grouped);
      } catch (err) {
        console.error("Gagal load:", err);
      }
    }
    fetchAttendances();
  }, [projectId]);

  // ➕ Tambah Presensi
  async function addEntry() {
    if (!selectedKey || !startTime || !endTime) {
      alert("Lengkapi semua data presensi terlebih dahulu.");
      return;
    }

    const payload = {
      date: selectedKey,
      start_time: startTime,
      end_time: endTime,
      type,
    };

    try {
      const res = await fetch(`/projects/${projectId}/attendances`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content"),
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Gagal menyimpan.");

      const newEntry = {
        id: result.data.id,
        type: result.data.type,
        start: result.data.start_time,
        end: result.data.end_time,
      };

      setAttendance((prev) => ({
        ...prev,
        [selectedKey]: [...(prev[selectedKey] || []), newEntry],
      }));

      setIsModalOpen(false);
      setStartTime("");
      setEndTime("");
      setType("Biasa");
      alert("Presensi berhasil disimpan!");
    } catch (err) {
      alert(err.message);
    }
  }

  // ✏️ Update Presensi
  async function updatePresensi() {
    if (!selectedPresensi?.id) return;
    if (!startTime || !endTime) {
      alert("Lengkapi semua data untuk update.");
      return;
    }

    const payload = {
      date: selectedKey,
      start_time: startTime,
      end_time: endTime,
      type,
    };

    try {
      const res = await fetch(
        `/projects/${projectId}/attendances/${selectedPresensi.id}`,
        {
          method: "PUT",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute("content"),
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal update presensi.");

      setAttendance((prev) => {
        const updated = { ...prev };
        if (updated[selectedKey]) {
          updated[selectedKey] = updated[selectedKey].map((item) =>
            item.id === selectedPresensi.id
              ? {
                  ...item,
                  start: payload.start_time,
                  end: payload.end_time,
                  type: payload.type,
                }
              : item
          );
        }
        return updated;
      });

      setIsEditMode(false);
      alert("Presensi berhasil diperbarui!");
    } catch (err) {
      alert(err.message);
    }
  }

  // 🗑 Hapus Presensi
  async function deletePresensi() {
    if (!selectedPresensi?.id) return;
    if (!confirm("Yakin ingin menghapus presensi ini?")) return;

    try {
      const res = await fetch(
        `/projects/${projectId}/attendances/${selectedPresensi.id}`,
        {
          method: "DELETE",
          credentials: "same-origin",
          headers: {
            "X-CSRF-TOKEN": document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute("content"),
          },
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal hapus presensi.");

      setAttendance((prev) => {
        const updated = { ...prev };
        if (updated[selectedKey]) {
          updated[selectedKey] = updated[selectedKey].filter(
            (x) => x.id !== selectedPresensi.id
          );
          if (updated[selectedKey].length === 0) delete updated[selectedKey];
        }
        return updated;
      });
      setIsDetailOpen(false);
      alert("Presensi berhasil dihapus!");
    } catch (err) {
      alert(err.message);
    }
  }

  const monthLabel = cursor.toLocaleString("id-ID", {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="space-y-4 p-6">
      {/* Navigasi Bulan */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
            }
          >
            {"‹"} Prev
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
            }
          >
            Next {"›"}
          </Button>
        </div>
        <h2 className="text-lg font-medium">{monthLabel}</h2>
        <div className="w-[84px]" />
      </div>

      {/* Kalender */}
      <Card className="p-4">
        <div className="grid grid-cols-7 text-center text-xs text-muted-foreground mb-2">
          {WEEKDAYS.map((w) => (
            <div key={w} className="font-semibold py-1">
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {cells.map((cell, idx) => {
            if (!cell.date)
              return (
                <div
                  key={`blank-${idx}`}
                  className="h-28 rounded-md border border-dashed bg-muted/20"
                />
              );

            const isToday =
              cell.date.toDateString() === today.toDateString();
            const items = attendance[cell.key] ?? [];

            return (
              <div
                key={cell.key}
                className={`flex flex-col h-28 border rounded-md p-2 cursor-pointer hover:bg-muted ${
                  isToday ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => {
                  setSelectedKey(cell.key);
                  setSelectedPresensi(items[0] ?? null);
                  setStartTime(items[0]?.start || "");
                  setEndTime(items[0]?.end || "");
                  setType(items[0]?.type || "Biasa");
                  setIsDetailOpen(true);
                }}
              >
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium">
                    {cell.date.getDate()}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedKey(cell.key);
                      setIsModalOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {items.length ? (
                  items.map((x, i) => (
                    <div
                      key={i}
                      className={`text-xs rounded-md px-2 py-1 truncate ${
                        x.type === "Lembur"
                          ? "bg-orange-200 text-orange-900"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {x.type} ({formatTime(x.start)}-{formatTime(x.end)})
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No events</p>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Modal Tambah */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Presensi</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addEntry();
            }}
            className="space-y-3"
          >
            <Label>Jenis Presensi</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Biasa">Biasa</SelectItem>
                <SelectItem value="Lembur">Lembur</SelectItem>
              </SelectContent>
            </Select>
            <Label>Jam Mulai</Label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <Label>Jam Selesai</Label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            <DialogFooter className="pt-4">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Detail */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPresensi ? (
                <>
                  <div>
                    {new Date(selectedKey).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatTime(selectedPresensi.start)} -{" "}
                    {formatTime(selectedPresensi.end)}
                  </div>
                  <div className="text-sm font-medium text-gray-800">
                    {selectedPresensi.type}
                  </div>
                </>
              ) : (
                "Tidak ada presensi"
              )}
            </DialogTitle>
          </DialogHeader>

          {isEditMode && (
            <div className="space-y-2 mb-3">
              <Label>Jenis Presensi</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Biasa">Biasa</SelectItem>
                  <SelectItem value="Lembur">Lembur</SelectItem>
                </SelectContent>
              </Select>
              <Label>Jam Mulai</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <Label>Jam Selesai</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Nama</th>
                  <th className="p-2 border">Posisi</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {pekerjaDummy.map((p, i) => (
                  <tr key={i}>
                    <td className="border p-2">{p.nama}</td>
                    <td className="border p-2">{p.posisi}</td>
                    <td className="border p-2">
                      <span
                        className={`px-2 py-1 text-xs rounded text-white ${
                          p.status === "Hadir"
                            ? "bg-green-500"
                            : p.status === "Absen"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <DialogFooter className="flex justify-between pt-4">
            <Button variant="destructive" onClick={deletePresensi}>
              🗑 Hapus
            </Button>
            {isEditMode ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditMode(false)}
                >
                  Batal
                </Button>
                <Button onClick={updatePresensi}>Simpan Perubahan</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditMode(true)}>
                ✏️ Edit Presensi
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

PresensiIndex.layout = (page) => <Navbar children={page} />;

export default PresensiIndex;

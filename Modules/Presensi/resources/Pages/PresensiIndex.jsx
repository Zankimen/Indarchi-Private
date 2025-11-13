"use client"

import { useState, useMemo, useEffect } from "react"
import Navbar from "@/layout/NavBar"
import { usePage } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

function formatTime(time) {
  if (!time) return ""
  return time.slice(0, 5)
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}
function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}
function formatKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function PresensiIndex() {
  const { props } = usePage()
  const projectId = props.projectId
  const [workers, setWorkers] = useState([])
  const today = useMemo(() => new Date(), [])
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [attendance, setAttendance] = useState({})
  const [selectedKey, setSelectedKey] = useState(null)
  const [selectedPresensi, setSelectedPresensi] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [type, setType] = useState("Biasa")

  const start = startOfMonth(cursor)
  const end = endOfMonth(cursor)
  const daysInMonth = end.getDate()
  const startWeekday = start.getDay()

  const cells = []
  for (let i = 0; i < startWeekday; i++) cells.push({ date: null, key: null })
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(cursor.getFullYear(), cursor.getMonth(), d)
    cells.push({ date, key: formatKey(date) })
  }
  while (cells.length % 7 !== 0) cells.push({ date: null, key: null })

  useEffect(() => {
    async function fetchAttendances() {
      try {
        const res = await fetch(`/projects/${projectId}/attendances`, {
          credentials: "same-origin",
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Gagal ambil data.")

        const grouped = data.reduce((acc, item) => {
          const key = item.date
          if (!acc[key]) acc[key] = []
          acc[key].push({
            id: item.id,
            type: item.type,
            start: item.start_time,
            end: item.end_time,
          })
          return acc
        }, {})
        setAttendance(grouped)
      } catch (err) {
        console.error("Gagal load:", err)
      }
    }
    fetchAttendances()
  }, [projectId])

  async function addEntry() {
    if (!selectedKey || !startTime || !endTime) {
      alert("Lengkapi semua data presensi terlebih dahulu.")
      return
    }

    const payload = {
      date: selectedKey,
      start_time: startTime,
      end_time: endTime,
      type,
    }

    try {
      const res = await fetch(`/projects/${projectId}/attendances`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),
        },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message || "Gagal menyimpan.")

      const newEntry = {
        id: result.data.id,
        type: result.data.type,
        start: result.data.start_time,
        end: result.data.end_time,
      }

      setAttendance((prev) => ({
        ...prev,
        [selectedKey]: [...(prev[selectedKey] || []), newEntry],
      }))

      setIsModalOpen(false)
      setStartTime("")
      setEndTime("")
      setType("Biasa")
      alert("Presensi berhasil disimpan!")
    } catch (err) {
      alert(err.message)
    }
  }

  async function updatePresensi() {
    if (!selectedPresensi?.id) return
    if (!startTime || !endTime) {
      alert("Lengkapi semua data untuk update.")
      return
    }

    const payload = {
      date: selectedKey,
      start_time: startTime,
      end_time: endTime,
      type,
    }

    try {
      const res = await fetch(`/projects/${projectId}/attendances/${selectedPresensi.id}`, {
        method: "PUT",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),
        },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Gagal update presensi.")

      setAttendance((prev) => {
        const updated = { ...prev }
        if (updated[selectedKey]) {
          updated[selectedKey] = updated[selectedKey].map((item) =>
            item.id === selectedPresensi.id
              ? { ...item, start: payload.start_time, end: payload.end_time, type: payload.type }
              : item
          )
        }
        return updated
      })

      setIsEditMode(false)
      alert("Presensi berhasil diperbarui!")
    } catch (err) {
      alert(err.message)
    }
  }

  async function deletePresensi() {
    if (!selectedPresensi?.id) return
    if (!confirm("Yakin ingin menghapus presensi ini?")) return

    try {
      const res = await fetch(`/projects/${projectId}/attendances/${selectedPresensi.id}`, {
        method: "DELETE",
        credentials: "same-origin",
        headers: {
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),
        },
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Gagal hapus presensi.")

      setAttendance((prev) => {
        const updated = { ...prev }
        if (updated[selectedKey]) {
          updated[selectedKey] = updated[selectedKey].filter((x) => x.id !== selectedPresensi.id)
          if (updated[selectedKey].length === 0) delete updated[selectedKey]
        }
        return updated
      })
      setIsDetailOpen(false)
      alert("Presensi berhasil dihapus!")
    } catch (err) {
      alert(err.message)
    }
  }

  const monthLabel = cursor.toLocaleString("id-ID", {
    month: "long",
    year: "numeric",
  })

  function resetFields() {
    setStartTime("")
    setEndTime("")
    setType("Biasa")
  }

  return (
    <section className="space-y-4 p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none bg-transparent"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          >
            {"‹"} Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none bg-transparent"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          >
            Next {"›"}
          </Button>
        </div>
        <h2 className="text-base sm:text-lg font-medium text-center">{monthLabel}</h2>
        <div className="w-full sm:w-[84px]" />
      </div>

      <Card className="p-2 sm:p-4">
        <div className="grid grid-cols-7 text-center text-xs sm:text-sm text-muted-foreground mb-2">
          {WEEKDAYS.map((w) => (
            <div key={w} className="font-semibold py-1">
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {cells.map((cell, idx) => {
            if (!cell.date)
              return <div key={`blank-${idx}`} className="h-20 sm:h-28 rounded-md border border-dashed bg-muted/20" />

            const isToday = cell.date.toDateString() === today.toDateString()
            const items = attendance[cell.key] ?? []

            return (
              <div
                key={cell.key}
                className={`flex flex-col h-20 sm:h-28 border rounded-md p-1 sm:p-2 cursor-pointer hover:bg-muted transition-colors ${isToday ? "ring-2 ring-primary" : ""}`}
              >
                <div className="flex justify-between mb-1">
                  <span className="text-xs sm:text-sm font-medium">{cell.date.getDate()}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedKey(cell.key)
                      resetFields()
                      setIsModalOpen(true)
                    }}
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>

                {items.length ? (
                  <div className="flex-1 overflow-y-auto">
                    {items.map((x, i) => (
                      <div
                        key={i}
                        className={`text-xs rounded-md px-1 sm:px-2 py-0.5 sm:py-1 truncate mb-0.5 ${x.type === "Lembur"
                          ? "bg-orange-200 text-orange-900"
                          : "bg-secondary text-secondary-foreground"
                          }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedKey(cell.key)
                          setSelectedPresensi(x)
                          setStartTime(x.start || "")
                          setEndTime(x.end || "")
                          setType(x.type || "Biasa")
                          setIsDetailOpen(true)
                          setWorkers([])

                          fetch(`/projects/${projectId}/attendances/${x.id}/getAttendancesworkers`,)
                            .then((res) => res.json())
                            .then((data) => setWorkers(data.workers || []))
                            .catch((err) => console.error("Gagal ambil data pekerja:", err))
                        }}
                      >
                        {x.type} ({formatTime(x.start)}-{formatTime(x.end)})
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No events</p>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Modal Tambah */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Presensi</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              addEntry()
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
            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <Label>Jam Selesai</Label>
            <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
              <Button
                type="button"
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => {
                  setIsModalOpen(false)
                }}
              >
                Batal
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Presensi */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPresensi ? (
                <>
                  <div className="text-base sm:text-lg">
                    {new Date(selectedKey).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {formatTime(selectedPresensi.start)} - {formatTime(selectedPresensi.end)}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-800">{selectedPresensi.type}</div>
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
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              <Label>Jam Selesai</Label>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          )}

          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <table className="w-full text-xs sm:text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 sm:p-3 border text-left">Nama</th>
                  <th className="p-2 sm:p-3 border text-left">Email</th>
                  <th className="p-2 sm:p-3 border text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {workers.length > 0 ? (
                  workers.map((p, i) => (
                    <tr key={i}>
                      <td className="border p-2 sm:p-3">{p.name}</td>
                      <td className="border p-2 sm:p-3">{p.email}</td>
                      <td className="border p-2 sm:p-3">
                        <Select
                          value={p.status || "Absen"}
                          onValueChange={async (newStatus) => {
                            try {
                              const res = await fetch(
                                `/projects/${projectId}/attendances/${selectedPresensi.id}/workers/${p.id}`,
                                {
                                  method: "PATCH",
                                  credentials: "same-origin",
                                  headers: {
                                    "Content-Type": "application/json",
                                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),
                                    Accept: "application/json",
                                  },
                                  body: JSON.stringify({ status: newStatus }),
                                }
                              );

                              const json = await res.json();
                              if (!res.ok) throw new Error(json?.message || json?.error || "Gagal memperbarui status");

                              setWorkers((prev) => prev.map((w) => (w.id === p.id ? { ...w, status: newStatus } : w)));
                            } catch (err) {
                              alert(err.message);
                            }
                          }}
                        >
                          <SelectTrigger
                            className={`w-24 text-xs font-medium ${(p.status || "Absen") === "Hadir"
                                ? "bg-green-100 text-green-700 border-green-400"
                                : (p.status || "Absen") === "Izin"
                                  ? "bg-yellow-100 text-yellow-700 border-yellow-400"
                                  : "bg-red-100 text-red-700 border-red-400"
                              }`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Hadir">Hadir</SelectItem>
                            <SelectItem value="Absen">Absen</SelectItem>
                            <SelectItem value="Izin">Izin</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center p-3 text-muted-foreground">
                      Tidak ada data pekerja
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button variant="destructive" onClick={deletePresensi} className="w-full sm:w-auto">
              🗑 Hapus
            </Button>
            {isEditMode ? (
              <>
                <Button variant="secondary" onClick={() => setIsEditMode(false)} className="w-full sm:w-auto">
                  Batal
                </Button>
                <Button onClick={updatePresensi} className="w-full sm:w-auto">
                  💾 Simpan
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditMode(true)} className="w-full sm:w-auto">
                ✏️ Edit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

PresensiIndex.layout = (page) => <Navbar>{page}</Navbar>

export default PresensiIndex

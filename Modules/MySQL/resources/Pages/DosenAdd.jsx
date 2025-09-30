import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, ImageIcon } from "lucide-react"

export default function CreateProjectPage() {
  const [formData, setFormData] = useState({
    namaProject: "",
    deskripsi: "",
    klien: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    lokasi: "",
    gambar: null,
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, gambar: file }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <div className="min-h-screen bg-primary p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-xl font-semibold">Buat Project Baru</h1>
          <Button variant="secondary" className="px-6 bg-background text-foreground hover:bg-accent hover:text-background cursor-pointer">
            Batal
          </Button>
        </div>

        <Card className="bg-background border-0">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="namaProject" className="text-sm font-medium text-muted-foreground">
                  Nama Project
                </Label>
                <Input
                  id="namaProject"
                  value={formData.namaProject}
                  onChange={(e) => handleInputChange("namaProject", e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deskripsi" className="text-sm font-medium text-muted-foreground">
                  Deskripsi
                </Label>
                <Textarea
                  id="deskripsi"
                  value={formData.deskripsi}
                  onChange={(e) => handleInputChange("deskripsi", e.target.value)}
                  className="w-full min-h-[80px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="klien" className="text-sm font-medium text-muted-foreground">
                  Klien
                </Label>
                <Input
                  id="klien"
                  value={formData.klien}
                  onChange={(e) => handleInputChange("klien", e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggalMulai" className="text-sm font-medium text-muted-foreground">
                  Tanggal Mulai
                </Label>
                <div className="relative">
                  <Input
                    id="tanggalMulai"
                    type="date"
                    value={formData.tanggalMulai}
                    onChange={(e) => handleInputChange("tanggalMulai", e.target.value)}
                    className="w-full pr-10 text-muted-foreground"
                    placeholder="dd/mm/yyyy"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggalSelesai" className="text-sm font-medium text-muted-foreground">
                  Tanggal Selesai
                </Label>
                <div className="relative">
                  <Input
                    id="tanggalSelesai"
                    type="date"
                    value={formData.tanggalSelesai}
                    onChange={(e) => handleInputChange("tanggalSelesai", e.target.value)}
                    className="w-full pr-10 text-muted-foreground"
                    placeholder="dd/mm/yyyy"
                  />
                </div>
              </div>

              {/* Lokasi */}
              <div className="space-y-2">
                <Label htmlFor="lokasi" className="text-sm font-medium text-muted-foreground">
                  Lokasi
                </Label>
                <Input
                  id="lokasi"
                  value={formData.lokasi}
                  onChange={(e) => handleInputChange("lokasi", e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Gambar</Label>
                <div className="border-2 border-dashed border-border rounded-lg text-center bg-muted">
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-2 p-8">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Unggah File untuk Project ini</span>
                        <br />
                        Format: JPG, PNG, Maksimal 5MB
                      </div>
                    </div>
                  </label>
                  {formData.gambar && (
                    <div className="mt-2 text-sm text-muted-foreground">File terpilih: {formData.gambar.name}</div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-primary hover:bg-accent text-primary-foreground px-6 cursor-pointer">
                  Simpan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

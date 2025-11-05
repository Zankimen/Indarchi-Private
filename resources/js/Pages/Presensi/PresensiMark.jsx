import React, { useState, useEffect } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import Navbar from "@/layout/NavBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  MapPin,
  LogIn,
  LogOut,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function PresensiMark({ project, status }) {
  const { flash } = usePage().props;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const clockInForm = useForm({
    latitude: null,
    longitude: null,
    lokasi: null,
  });

  const clockOutForm = useForm({
    latitude: null,
    longitude: null,
    lokasi: null,
  });

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get location
  const getLocation = () => {
    setLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation tidak didukung oleh browser Anda");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ latitude: lat, longitude: lng });
        setLoadingLocation(false);

        // Update both forms
        clockInForm.setData({
          latitude: lat,
          longitude: lng,
          lokasi: `${lat}, ${lng}`,
        });
        clockOutForm.setData({
          latitude: lat,
          longitude: lng,
          lokasi: `${lat}, ${lng}`,
        });
      },
      (error) => {
        setLocationError("Gagal mendapatkan lokasi: " + error.message);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  // Handle clock in
  const handleClockIn = (e) => {
    e.preventDefault();
    clockInForm.post(`/projects/${project.id}/presensi/clock-in`, {
      preserveScroll: true,
      onSuccess: () => {
        // Refresh the page to get updated status
        router.reload();
      },
    });
  };

  // Handle clock out
  const handleClockOut = (e) => {
    e.preventDefault();
    clockOutForm.post(`/projects/${project.id}/presensi/clock-out`, {
      preserveScroll: true,
      onSuccess: () => {
        router.reload();
      },
    });
  };

  return (
    <>
      <Head title={`Absen - ${project.nama}`} />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <div className="max-w-md mx-auto space-y-4 py-8">
          {/* Header */}
          <Card className="border-border bg-background/95 backdrop-blur">
            <div className="px-6 py-4 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {project.nama}
              </h1>
              <p className="text-sm text-muted-foreground">Sistem Presensi</p>
            </div>
          </Card>

          {/* Date & Time Display */}
          <Card className="border-border bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <div className="px-6 py-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="w-5 h-5" />
                <p className="text-sm font-medium opacity-90">
                  {formatDate(currentTime)}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 mb-1">
                <Clock className="w-8 h-8" />
                <p className="text-5xl font-bold tracking-tight">
                  {formatTime(currentTime)}
                </p>
              </div>
            </div>
          </Card>

          {/* Flash Messages */}
          {flash?.success && (
            <Card className="border-green-500 bg-green-50">
              <div className="px-4 py-3 flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                <p className="font-medium">{flash.success}</p>
              </div>
            </Card>
          )}

          {flash?.error && (
            <Card className="border-red-500 bg-red-50">
              <div className="px-4 py-3 flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <p className="font-medium">{flash.error}</p>
              </div>
            </Card>
          )}

          {/* Current Status */}
          {status.has_clocked_in && (
            <Card className="border-border">
              <div className="px-6 py-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Status Hari Ini
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Jam Masuk:</span>
                    <span className="font-semibold">
                      {status.attendance.jam_masuk
                        ? status.attendance.jam_masuk.substring(0, 5)
                        : "-"}
                    </span>
                  </div>
                  {status.has_clocked_out && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Jam Keluar:</span>
                      <span className="font-semibold">
                        {status.attendance.jam_keluar
                          ? status.attendance.jam_keluar.substring(0, 5)
                          : "-"}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-semibold capitalize">
                      {status.attendance.status}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Location */}
          <Card className="border-border">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Lokasi
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={getLocation}
                  disabled={loadingLocation}
                  className="cursor-pointer"
                >
                  {loadingLocation ? "Memuat..." : "Dapatkan Lokasi"}
                </Button>
              </div>

              {location ? (
                <div className="text-sm bg-muted p-3 rounded-lg">
                  <p className="text-muted-foreground mb-1">Koordinat:</p>
                  <p className="font-mono text-xs break-all">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {locationError || "Belum ada data lokasi"}
                </p>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!status.has_clocked_in ? (
              <form onSubmit={handleClockIn}>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-16 text-lg font-semibold cursor-pointer"
                  disabled={clockInForm.processing || !location}
                >
                  <LogIn className="w-6 h-6 mr-2" />
                  {clockInForm.processing ? "Memproses..." : "Absen Masuk"}
                </Button>
              </form>
            ) : !status.has_clocked_out ? (
              <form onSubmit={handleClockOut}>
                <Button
                  type="submit"
                  size="lg"
                  variant="secondary"
                  className="w-full h-16 text-lg font-semibold cursor-pointer"
                  disabled={clockOutForm.processing || !location}
                >
                  <LogOut className="w-6 h-6 mr-2" />
                  {clockOutForm.processing ? "Memproses..." : "Absen Keluar"}
                </Button>
              </form>
            ) : (
              <Card className="border-green-500 bg-green-50">
                <div className="px-6 py-4 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-green-700">
                    Presensi Hari Ini Selesai
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Terima kasih atas kerja keras Anda!
                  </p>
                </div>
              </Card>
            )}

            <Button
              variant="outline"
              size="lg"
              className="w-full cursor-pointer"
              onClick={() => router.visit(`/projects/${project.id}/presensi`)}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Lihat Kalender Presensi
            </Button>
          </div>

          {/* Info */}
          <Card className="border-border bg-muted/30">
            <div className="px-6 py-4">
              <p className="text-xs text-center text-muted-foreground">
                Pastikan lokasi GPS Anda aktif untuk melakukan absensi.
                Sistem akan memverifikasi lokasi Anda berada di area proyek.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

PresensiMark.layout = (page) => <Navbar children={page} />;

export default PresensiMark;


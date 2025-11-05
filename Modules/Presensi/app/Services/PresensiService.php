<?php

namespace Modules\Presensi\Services;

use Modules\Presensi\Models\Presensi;
use Modules\Presensi\Repositories\Eloquent\PresensiRepository;
use Modules\Project\Repositories\Eloquent\ProjectRepository;
use Carbon\Carbon;

class PresensiService
{
    protected PresensiRepository $presensiRepository;
    protected ProjectRepository $projectRepository;

    public function __construct(
        PresensiRepository $presensiRepository,
        ProjectRepository $projectRepository
    ) {
        $this->presensiRepository = $presensiRepository;
        $this->projectRepository = $projectRepository;
    }

    public function clockIn(array $data)
    {
        $today = Carbon::today()->toDateString();
        
        // Check if already clocked in today
        $existingPresensi = $this->presensiRepository->findByUserProjectAndDate(
            $data['user_id'],
            $data['project_id'],
            $today
        );

        if ($existingPresensi) {
            throw new \Exception('Anda sudah melakukan absen masuk hari ini');
        }

        // Verify location if needed
        if (isset($data['latitude_masuk']) && isset($data['longitude_masuk'])) {
            $project = $this->projectRepository->find($data['project_id']);
            
            // Simple distance check (you might want to implement a more accurate method)
            $isWithinRadius = $this->checkLocationWithinRadius(
                $data['latitude_masuk'],
                $data['longitude_masuk'],
                $project
            );

            if (!$isWithinRadius) {
                throw new \Exception('Lokasi Anda diluar jangkauan radius project');
            }
        }

        $presensiData = [
            'user_id' => $data['user_id'],
            'project_id' => $data['project_id'],
            'tanggal' => $today,
            'jam_masuk' => now()->format('H:i:s'),
            'lokasi_masuk' => $data['lokasi_masuk'] ?? null,
            'latitude_masuk' => $data['latitude_masuk'] ?? null,
            'longitude_masuk' => $data['longitude_masuk'] ?? null,
            'status' => 'hadir',
        ];

        return $this->presensiRepository->create($presensiData);
    }

    public function clockOut(array $data)
    {
        $today = Carbon::today()->toDateString();
        
        $existingPresensi = $this->presensiRepository->findByUserProjectAndDate(
            $data['user_id'],
            $data['project_id'],
            $today
        );

        if (!$existingPresensi) {
            throw new \Exception('Anda belum melakukan absen masuk hari ini');
        }

        if ($existingPresensi->jam_keluar) {
            throw new \Exception('Anda sudah melakukan absen keluar hari ini');
        }

        $updateData = [
            'jam_keluar' => now()->format('H:i:s'),
            'lokasi_keluar' => $data['lokasi_keluar'] ?? null,
            'latitude_keluar' => $data['latitude_keluar'] ?? null,
            'longitude_keluar' => $data['longitude_keluar'] ?? null,
        ];

        return $this->presensiRepository->update($existingPresensi, $updateData);
    }

    public function getMonthlyAttendance($userId, $projectId, $year, $month)
    {
        $attendance = $this->presensiRepository->getMonthlyAttendance($userId, $projectId, $year, $month);
        
        // Convert to array indexed by date
        $attendanceByDate = [];
        foreach ($attendance as $record) {
            $attendanceByDate[$record->tanggal->format('Y-m-d')] = $record;
        }

        return $attendanceByDate;
    }

    public function getProjectMonthlyAttendance($projectId, $year, $month)
    {
        return $this->presensiRepository->getProjectMonthlyAttendance($projectId, $year, $month);
    }

    public function getTodayAttendanceStatus($userId, $projectId)
    {
        $today = Carbon::today()->toDateString();
        $attendance = $this->presensiRepository->findByUserProjectAndDate($userId, $projectId, $today);

        if (!$attendance) {
            return [
                'has_clocked_in' => false,
                'has_clocked_out' => false,
                'attendance' => null,
            ];
        }

        return [
            'has_clocked_in' => true,
            'has_clocked_out' => !is_null($attendance->jam_keluar),
            'attendance' => $attendance,
        ];
    }

    public function getPresensiPaginated($request, $projectId)
    {
        return $this->presensiRepository->getFilteredSortedAndSearched($request, $projectId);
    }

    private function checkLocationWithinRadius($latitude, $longitude, $project)
    {
        // This is a simple implementation
        // You might want to use a more accurate method like Haversine formula
        
        // For now, we'll return true - implement actual distance calculation
        // based on project->radius and project->lokasi coordinates
        
        return true;
    }

    public function findPresensiById(int $id)
    {
        return $this->presensiRepository->find($id);
    }

    public function updatePresensi(Presensi $presensi, array $data)
    {
        return $this->presensiRepository->update($presensi, $data);
    }

    public function deletePresensi($id)
    {
        return $this->presensiRepository->delete($id);
    }
}


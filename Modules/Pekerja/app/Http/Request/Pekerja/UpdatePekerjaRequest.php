<?php

namespace Modules\Pekerja\Http\Request\Pekerja;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePekerjaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Get the user ID from the route parameter
        $userId = $this->route('id');

        return [
            'nama_karyawan' => 'required|string|max:255',
            'alamat' => 'required|string',
            'posisi' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email,' . $userId,
            'password' => 'nullable|min:8',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.min' => 'Password minimal 8 karakter.',
            'nama_karyawan.required' => 'Nama karyawan wajib diisi.',
            'nama_karyawan.max' => 'Nama karyawan maksimal 255 karakter.',
            'alamat.required' => 'Alamat wajib diisi.',
            'posisi.required' => 'Posisi wajib dipilih.',
        ];
    }
}
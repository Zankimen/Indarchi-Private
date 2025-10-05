<?php

namespace Modules\Pekerja\Http\Request\Pekerja;

use Illuminate\Foundation\Http\FormRequest;

class CreatePekerjaRequest extends FormRequest
{   
    public function rules(): array
    {
        return [
            'email' => 'required|email|unique:users,email|max:255',
            'password' => 'required|string|min:8|max:255',
            'nama_karyawan' => 'required|string|max:255',
            'alamat' => 'required|string',
            'posisi' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'email.max' => 'Email maksimal 255 karakter.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.max' => 'Password maksimal 255 karakter.',
            'nama_karyawan.required' => 'Nama karyawan wajib diisi.',
            'nama_karyawan.max' => 'Nama karyawan maksimal 255 karakter.',
            'alamat.required' => 'Alamat wajib diisi.',
            'posisi.required' => 'Posisi wajib dipilih.',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
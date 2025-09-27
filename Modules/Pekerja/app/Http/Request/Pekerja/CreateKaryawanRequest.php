<?php

namespace Modules\Pekerja\Http\Request\Pekerja;

use Illuminate\Foundation\Http\FormRequest;

class CreateKaryawanRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'nama_karyawan' => 'required|string|max:255',
            'alamat' => 'required|string',
            'posisi' => 'required|in:supervisor,manager,kuli,mandor',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'nama_karyawan.required' => 'Nama karyawan wajib diisi.',
            'nama_karyawan.max' => 'Nama karyawan maksimal 255 karakter.',
            'alamat.required' => 'Alamat wajib diisi.',
            'posisi.required' => 'Posisi wajib dipilih.',
            'posisi.in' => 'Posisi harus salah satu dari: supervisor, manager, kuli, mandor.',
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
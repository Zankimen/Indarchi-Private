<?php

namespace Modules\Pekerja\Http\Request\Pekerja;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectPekerjaPeranRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'posisi' => 'required|string|exists:roles,name',
        ];
    }

    public function messages(): array
    {
        return [
            'posisi.required' => 'Posisi wajib diisi.',
            'posisi.string' => 'Posisi harus berupa teks.',
            'posisi.exists' => 'Posisi yang dipilih tidak valid atau tidak ditemukan.',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}

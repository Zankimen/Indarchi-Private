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
        return [
            'nama_karyawan' => 'required|string|max:255',
            'alamat' => 'required|string',
            'posisi' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email,' . $this->route('user_id'),
            'password' => 'nullable|min:6',
        ];
    }
}

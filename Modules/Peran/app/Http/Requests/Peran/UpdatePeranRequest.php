<?php

namespace Modules\Peran\Http\Requests\Peran;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePeranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Fixed: Changed from 'roles,name' to 'roles,nama' to match database column
            'nama' => 'required|string|max:255|unique:roles,nama,' . $this->route('role')->id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id'
        ];
    }

    public function messages(): array
    {
        return [
            'nama.required' => 'Nama peran harus diisi.',
            'nama.unique' => 'Nama peran sudah ada.',
            'permissions.*.exists' => 'Permission yang dipilih tidak valid.'
        ];
    }
}

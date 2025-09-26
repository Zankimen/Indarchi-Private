<?php

namespace Modules\Peran\Http\Requests\Peran;

use Illuminate\Foundation\Http\FormRequest;

class CreatePeranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:255|unique:roles,nama',
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

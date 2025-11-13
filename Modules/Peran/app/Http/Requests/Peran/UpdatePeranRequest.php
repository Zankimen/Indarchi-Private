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
        // Cek apakah ini route untuk dashboard atau project
        $peranId = $this->route('peran')
            ? $this->route('peran')->id
            : $this->route('peran_id');

        return [
            'name' => 'required|string|max:255|unique:roles,name,' . $peranId,
            'deskripsi' => 'nullable|string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama peran harus diisi.',
            'name.unique' => 'Nama peran sudah ada.',
            'permissions.*.exists' => 'Permission yang dipilih tidak valid.',
        ];
    }
}

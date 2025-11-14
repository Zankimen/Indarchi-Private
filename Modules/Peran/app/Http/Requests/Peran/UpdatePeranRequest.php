<?php

namespace Modules\Peran\Http\Requests\Peran;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePeranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $peranId = $this->route('peran')
            ? $this->route('peran')->id
            : $this->route('peran_id');

        $peran = $this->route('peran');

        if ($peran && strtolower($peran->name) === 'admin') {
            return [
                'name' => 'prohibited',
                'deskripsi' => 'prohibited',
                'permissions' => 'prohibited',
            ];
        }

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles', 'name')->ignore($peranId),
            ],
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
            'name.prohibited' => 'Peran ini dilindungi dan tidak dapat diubah.',
            'deskripsi.prohibited' => 'Peran ini dilindungi dan tidak dapat diubah.',
            'permissions.prohibited' => 'Peran ini dilindungi dan tidak dapat diubah.',
            'permissions.*.exists' => 'Permission yang dipilih tidak valid.',
        ];
    }
}

<?php

namespace Modules\Pekerja\Http\Request\Pekerja;

use Illuminate\Foundation\Http\FormRequest;

class AddToProjectRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'pekerja_id' => 'required|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            'pekerja_id.required' => 'Pekerja wajib dipilih.',
            'pekerja_id.exists' => 'Pekerja yang dipilih tidak ditemukan.',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}

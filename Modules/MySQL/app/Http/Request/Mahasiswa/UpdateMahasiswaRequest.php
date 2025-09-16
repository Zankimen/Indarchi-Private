<?php

namespace Modules\MySQL\Http\Request\Mahasiswa;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMahasiswaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama'   => 'required|string|max:200',
            'alamat' => 'required|string|max:200',
        ];
    }
}

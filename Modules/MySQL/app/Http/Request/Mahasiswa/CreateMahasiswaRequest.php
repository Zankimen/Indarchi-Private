<?php

namespace Modules\MySQL\Http\Request\Mahasiswa;

use Illuminate\Foundation\Http\FormRequest;

class CreateMahasiswaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nim'    => 'required|string|max:8|unique:mahasiswa,nim',
            'nama'   => 'required|string|max:200',
            'alamat' => 'required|string|max:200',
        ];
    }
}

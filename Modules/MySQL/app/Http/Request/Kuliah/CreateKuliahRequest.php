<?php

namespace Modules\MySQL\Http\Request\Kuliah;

use Illuminate\Foundation\Http\FormRequest;

class CreateKuliahRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'dosen'       => 'required|exists:dosen,nama',
            'mahasiswa'   => 'required|exists:mahasiswa,nama',
            'mataKuliah'  => 'required|exists:mata_kuliah,nama',
            'nilai'       => 'required|integer',
        ];
    }
}

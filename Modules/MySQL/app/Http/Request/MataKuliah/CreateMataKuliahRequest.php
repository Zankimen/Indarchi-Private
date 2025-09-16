<?php

namespace Modules\MySQL\Http\Request\MataKuliah;

use Illuminate\Foundation\Http\FormRequest;

class CreateMataKuliahRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kode'    => 'required|string|max:10|unique:mata_kuliah,kode',
            'nama'   => 'required|string|max:200',
            'sks' => 'required|numeric',
            'semester' => 'required|numeric'
        ];
    }
}

<?php

namespace Modules\MySQL\Http\Request\MataKuliah;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMataKuliahRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama'   => 'required|string|max:200',
            'sks' => 'required|numeric',
            'semester' => 'required|numeric'
        ];
    }
}

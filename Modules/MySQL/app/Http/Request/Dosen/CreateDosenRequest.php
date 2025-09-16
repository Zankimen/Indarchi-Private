<?php

namespace Modules\MySQL\Http\Request\Dosen;

use Illuminate\Foundation\Http\FormRequest;

class CreateDosenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nip'    => 'required|string|max:8|unique:dosen,nip',
            'nama'   => 'required|string|max:200',
            'alamat' => 'required|string|max:200',
        ];
    }
}

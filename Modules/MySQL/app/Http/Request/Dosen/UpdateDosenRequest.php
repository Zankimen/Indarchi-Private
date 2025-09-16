<?php

namespace Modules\MySQL\Http\Request\Dosen;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDosenRequest extends FormRequest
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

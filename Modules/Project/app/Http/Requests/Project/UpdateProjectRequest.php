<?php

namespace Modules\Project\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama'            => 'required|string|max:255',
            'deskripsi'       => 'nullable|string',
            'klien'       => 'nullable|string',
            'lokasi'          => 'required|string|max:255',
            'tanggal_mulai'   => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'radius'          => 'required|numeric',
        ];
    }
}
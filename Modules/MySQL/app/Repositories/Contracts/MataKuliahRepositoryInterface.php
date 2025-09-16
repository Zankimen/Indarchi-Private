<?php

namespace Modules\MySQL\Repositories\Contracts;

use Modules\MySQL\Models\MataKuliah;

interface MataKuliahRepositoryInterface
{
    public function all();
    public function getFilteredSortedAndSearched($request);
    public function find($id);
    public function create(array $data);
    public function update(MataKuliah $mataKuliah, array $data);
    public function delete($id);
    public function getAllMataKuliahNoAll();
}

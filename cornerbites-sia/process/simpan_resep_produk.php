
<?php
require_once __DIR__ . '/../includes/auth_check.php';
require_once __DIR__ . '/../config/db.php';

try {
    $conn = $db;

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $action = $_POST['action'] ?? null;
        $product_id = $_POST['product_id'] ?? null;

        if (!$product_id) {
            throw new Exception('Product ID tidak ditemukan');
        }

        switch ($action) {
            case 'add_bahan':
            case 'add_kemasan':
                $raw_material_id = $_POST['raw_material_id'] ?? null;
                $quantity_used = $_POST['quantity_used'] ?? null;
                $unit_measurement = $_POST['unit_measurement'] ?? null;

                if (!$raw_material_id || !$quantity_used || !$unit_measurement) {
                    throw new Exception('Data tidak lengkap');
                }

                // Check if combination already exists
                $checkStmt = $conn->prepare("SELECT id FROM product_recipes WHERE product_id = ? AND raw_material_id = ?");
                $checkStmt->execute([$product_id, $raw_material_id]);
                
                if ($checkStmt->fetch()) {
                    throw new Exception('Bahan ini sudah ada dalam resep. Silakan edit yang sudah ada.');
                }

                $stmt = $conn->prepare("INSERT INTO product_recipes (product_id, raw_material_id, quantity_used, unit_measurement) VALUES (?, ?, ?, ?)");
                $stmt->execute([$product_id, $raw_material_id, $quantity_used, $unit_measurement]);

                $_SESSION['resep_message'] = [
                    'text' => ($action === 'add_bahan' ? 'Bahan baku' : 'Kemasan') . ' berhasil ditambahkan ke resep',
                    'type' => 'success'
                ];
                break;

            case 'edit':
                $recipe_id = $_POST['recipe_id'] ?? null;
                $raw_material_id = $_POST['raw_material_id'] ?? null;
                $quantity_used = $_POST['quantity_used'] ?? null;
                $unit_measurement = $_POST['unit_measurement'] ?? null;

                if (!$recipe_id || !$raw_material_id || !$quantity_used || !$unit_measurement) {
                    throw new Exception('Data tidak lengkap');
                }

                $stmt = $conn->prepare("UPDATE product_recipes SET raw_material_id = ?, quantity_used = ?, unit_measurement = ? WHERE id = ? AND product_id = ?");
                $stmt->execute([$raw_material_id, $quantity_used, $unit_measurement, $recipe_id, $product_id]);

                $_SESSION['resep_message'] = [
                    'text' => 'Item resep berhasil diupdate',
                    'type' => 'success'
                ];
                break;

            case 'update_product_info':
                $production_yield = $_POST['production_yield'] ?? 1;
                $production_time_hours = $_POST['production_time_hours'] ?? 1;
                $sale_price = $_POST['sale_price'] ?? 0;

                $stmt = $conn->prepare("UPDATE products SET production_yield = ?, production_time_hours = ?, sale_price = ? WHERE id = ?");
                $stmt->execute([$production_yield, $production_time_hours, $sale_price, $product_id]);

                $_SESSION['resep_message'] = [
                    'text' => 'Informasi produk berhasil diupdate',
                    'type' => 'success'
                ];
                break;

            default:
                throw new Exception('Action tidak valid');
        }

        // Redirect back to resep page
        header("Location: ../pages/resep_produk.php?product_id=" . $product_id);
        exit;

    } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $action = $_GET['action'] ?? null;
        $id = $_GET['id'] ?? null;
        $product_id = $_GET['product_id'] ?? null;

        if ($action === 'delete' && $id && $product_id) {
            $stmt = $conn->prepare("DELETE FROM product_recipes WHERE id = ? AND product_id = ?");
            $stmt->execute([$id, $product_id]);

            $_SESSION['resep_message'] = [
                'text' => 'Item berhasil dihapus dari resep',
                'type' => 'success'
            ];

            header("Location: ../pages/resep_produk.php?product_id=" . $product_id);
            exit;
        }
    }

} catch (PDOException $e) {
    error_log("Database error in simpan_resep_produk.php: " . $e->getMessage());
    $_SESSION['resep_message'] = [
        'text' => 'Terjadi kesalahan database: ' . $e->getMessage(),
        'type' => 'error'
    ];
    
    if (isset($product_id)) {
        header("Location: ../pages/resep_produk.php?product_id=" . $product_id);
    } else {
        header("Location: ../pages/resep_produk.php");
    }
    exit;

} catch (Exception $e) {
    error_log("General error in simpan_resep_produk.php: " . $e->getMessage());
    $_SESSION['resep_message'] = [
        'text' => $e->getMessage(),
        'type' => 'error'
    ];
    
    if (isset($product_id)) {
        header("Location: ../pages/resep_produk.php?product_id=" . $product_id);
    } else {
        header("Location: ../pages/resep_produk.php");
    }
    exit;
}
?>

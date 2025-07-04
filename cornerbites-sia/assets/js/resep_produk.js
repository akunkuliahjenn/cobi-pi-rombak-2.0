
// Definisikan recipeUnitOptions di JavaScript untuk reset form yang benar
const recipeUnitOptions = ['gram', 'kg', 'ml', 'liter', 'pcs', 'buah', 'sendok teh', 'sendok makan', 'cangkir'];

// Format Rupiah function
function formatRupiah(element, hiddenInputId) {
    let value = element.value.replace(/[^0-9]/g, '');

    if (value === '') {
        element.value = '';
        document.getElementById(hiddenInputId).value = '';
        return;
    }

    let formatted = new Intl.NumberFormat('id-ID').format(value);
    element.value = formatted;
    document.getElementById(hiddenInputId).value = value;
}

// Edit resep item function
function editResepItem(item) {
    // Set form values
    document.getElementById('recipe_item_id').value = item.id;
    document.getElementById('quantity_used').value = item.quantity_used;
    document.getElementById('unit_measurement').value = item.unit_measurement;
    document.getElementById('form_action').value = 'edit';

    // Show appropriate tab based on raw material type
    if (item.raw_material_type === 'bahan') {
        showCategoryTab('bahan');
        document.getElementById('raw_material_id_bahan').value = item.raw_material_id;
        document.getElementById('raw_material_id').value = item.raw_material_id;
    } else {
        showCategoryTab('kemasan');
        document.getElementById('raw_material_id_kemasan').value = item.raw_material_id;
        document.getElementById('raw_material_id').value = item.raw_material_id;
    }

    // Update form title and button
    document.getElementById('form-resep-title').textContent = 'Edit Item Resep';
    const submitButton = document.getElementById('submit_resep_button');
    const cancelButton = document.getElementById('cancel_edit_resep_button');

    submitButton.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
        </svg>
        Update Item Resep
    `;
    submitButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
    submitButton.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
    cancelButton.classList.remove('hidden');

    // Scroll to form
    document.getElementById('form-resep-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Reset resep form function
function resetResepForm() {
    document.getElementById('recipe_item_id').value = '';
    document.getElementById('quantity_used').value = '';
    document.getElementById('unit_measurement').value = recipeUnitOptions[0];
    document.getElementById('raw_material_id_bahan').value = '';
    document.getElementById('raw_material_id_kemasan').value = '';
    document.getElementById('raw_material_id').value = '';
    document.getElementById('form_action').value = 'add';

    document.getElementById('form-resep-title').textContent = 'Tambah Item ke Resep';
    const submitButton = document.getElementById('submit_resep_button');
    const cancelButton = document.getElementById('cancel_edit_resep_button');

    submitButton.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Tambah Item Resep
    `;
    submitButton.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
    submitButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
    cancelButton.classList.add('hidden');

    // Reset to bahan tab
    showCategoryTab('bahan');
}

// Reset bahan form function
function resetBahanForm() {
    document.getElementById('bahan_recipe_item_id').value = '';
    document.getElementById('bahan_quantity_used').value = '';
    document.getElementById('bahan_unit_measurement').value = recipeUnitOptions[0];
    document.getElementById('bahan_raw_material_id').value = '';

    document.getElementById('form-bahan-title').textContent = 'Tambah Bahan Baku ke Resep';
    const submitButton = document.getElementById('submit_bahan_button');
    const cancelButton = document.getElementById('cancel_edit_bahan_button');

    submitButton.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Tambah Bahan
    `;
    submitButton.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
    submitButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
    cancelButton.classList.add('hidden');
}

// Reset kemasan form function
function resetKemasanForm() {
    document.getElementById('kemasan_recipe_item_id').value = '';
    document.getElementById('kemasan_quantity_used').value = '';
    document.getElementById('kemasan_unit_measurement').value = recipeUnitOptions[0];
    document.getElementById('kemasan_raw_material_id').value = '';

    document.getElementById('form-kemasan-title').textContent = 'Tambah Kemasan ke Resep';
    const submitButton = document.getElementById('submit_kemasan_button');
    const cancelButton = document.getElementById('cancel_edit_kemasan_button');

    submitButton.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Tambah Kemasan
    `;
    submitButton.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
    submitButton.classList.add('bg-green-600', 'hover:bg-green-700');
    cancelButton.classList.add('hidden');
}

// Real-time search dengan debouncing dan scroll position preservation
let searchTimeoutRecipe;
let limitTimeoutRecipe;
let currentScrollPosition = 0;

function saveScrollPosition() {
    currentScrollPosition = window.pageYOffset;
}

function restoreScrollPosition() {
    window.scrollTo(0, currentScrollPosition);
}

function applySearchRealtimeRecipe(searchTerm, limit = null) {
    saveScrollPosition();

    let currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('search_recipe', searchTerm);
    currentUrl.searchParams.set('recipe_page', '1');
    if (limit !== null) {
        currentUrl.searchParams.set('recipe_limit', limit);
    }

    // Store scroll position in sessionStorage
    sessionStorage.setItem('resepScrollPosition', currentScrollPosition);

    window.location.href = currentUrl.toString();
}

// Form validation before submission
function validateRecipeForm() {
    const bahanSelect = document.getElementById('raw_material_id_bahan');
    const kemasamSelect = document.getElementById('raw_material_id_kemasan');

    // Check which tab is active
    const bahanTab = document.getElementById('content-bahan');
    const kemasamTab = document.getElementById('content-kemasan');

    if (!bahanTab.classList.contains('hidden')) {
        // Bahan tab is active
        if (!bahanSelect.value) {
            alert('Silakan pilih bahan baku');
            return false;
        }
        // Set the raw_material_id for submission
        document.getElementById('raw_material_id').value = bahanSelect.value;
    } else if (!kemasamTab.classList.contains('hidden')) {
        // Kemasan tab is active
        if (!kemasamSelect.value) {
            alert('Silakan pilih kemasan');
            return false;
        }
        // Set the raw_material_id for submission
        document.getElementById('raw_material_id').value = kemasamSelect.value;
    }

    const quantityUsed = document.getElementById('quantity_used').value;
    if (!quantityUsed || quantityUsed <= 0) {
        alert('Silakan masukkan jumlah yang valid');
        return false;
    }

    return true;
}

function updateRecipeResults() {
    const searchValue = document.getElementById('search_recipe').value;
    const limitValue = document.getElementById('recipe_limit').value;
    const sectionValue = document.getElementById('section_filter').value;
    const productId = new URLSearchParams(window.location.search).get('product_id');

    if (productId) {
        const url = new URL(window.location.href);
        url.searchParams.set('search_recipe', searchValue);
        url.searchParams.set('recipe_limit', limitValue);
        url.searchParams.set('section', sectionValue);
        url.searchParams.set('recipe_page', '1'); // Reset ke halaman 1 saat search/filter berubah

        window.location.href = url.toString();
    }
}

// Function untuk menampilkan tab breakdown yang berbeda
function showBreakdownTab(tabName) {
    // Hide semua content
    document.getElementById('content-bahan_baku').classList.add('hidden');
    document.getElementById('content-tenaga_kerja').classList.add('hidden');
    document.getElementById('content-overhead').classList.add('hidden');

    // Reset semua tab button
    document.getElementById('tab-bahan_baku').className = 'px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700';
    document.getElementById('tab-tenaga_kerja').className = 'px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700';
    document.getElementById('tab-overhead').className = 'px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700';

    // Show content yang dipilih
    document.getElementById('content-' + tabName).classList.remove('hidden');

    // Set active tab
    document.getElementById('tab-' + tabName).className = 'px-6 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-blue-50';
}

// Function untuk menampilkan tab kategori bahan/kemasan
function showCategoryTab(categoryName) {
    // Hide semua content
    document.getElementById('content-bahan').classList.add('hidden');
    document.getElementById('content-kemasan').classList.add('hidden');

    // Reset semua tab button
    document.getElementById('tab-bahan').className = 'px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700';
    document.getElementById('tab-kemasan').className = 'px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700';

    // Show content yang dipilih
    document.getElementById('content-' + categoryName).classList.remove('hidden');

    // Set active tab
    document.getElementById('tab-' + categoryName).className = 'px-6 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-blue-50';

    // Clear dan reset dropdown yang tidak aktif, enable yang aktif
    if (categoryName === 'bahan') {
        const kemasamSelect = document.getElementById('raw_material_id_kemasan');
        const bahanSelect = document.getElementById('raw_material_id_bahan');

        if (kemasamSelect) {
            kemasamSelect.value = '';
            kemasamSelect.disabled = true;
            kemasamSelect.removeAttribute('name');
        }
        if (bahanSelect) {
            bahanSelect.disabled = false;
            bahanSelect.setAttribute('name', 'raw_material_id');
            bahanSelect.required = true;
        }
    } else {
        const bahanSelect = document.getElementById('raw_material_id_bahan');
        const kemasamSelect = document.getElementById('raw_material_id_kemasan');

        if (bahanSelect) {
            bahanSelect.value = '';
            bahanSelect.disabled = true;
            bahanSelect.removeAttribute('name');
        }
        if (kemasamSelect) {
            kemasamSelect.disabled = false;
            kemasamSelect.setAttribute('name', 'raw_material_id');
            kemasamSelect.required = true;
        }
    }
}

// Functions to show/hide forms
function showBahanForm() {
    // Hide all forms first
    hideAllForms();

    // Show bahan form
    document.getElementById('bahan-form-section').style.display = 'block';

    // Reset bahan form to default state
    resetBahanForm();

    // Scroll to form
    document.getElementById('bahan-form-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showKemasanForm() {
    // Hide all forms first
    hideAllForms();

    // Show kemasan form
    document.getElementById('kemasan-form-section').style.display = 'block';

    // Reset kemasan form to default state
    resetKemasanForm();

    // Scroll to form
    document.getElementById('kemasan-form-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showOverheadForm() {
    // Hide all forms first
    hideAllForms();

    // Show overhead form
    document.getElementById('overhead-form-section').style.display = 'block';

    // Scroll to form
    document.getElementById('overhead-form-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showTenagaKerjaForm() {
    // Hide all forms first
    hideAllForms();

    // Show tenaga kerja form
    document.getElementById('tenaga-kerja-form-section').style.display = 'block';

    // Scroll to form
    document.getElementById('tenaga-kerja-form-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideAllForms() {
    // Hide all form sections
    const formSections = [
        'bahan-form-section',
        'kemasan-form-section',
        'overhead-form-section',
        'tenaga-kerja-form-section'
    ];

    formSections.forEach(function(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.style.display = 'none';
        }
    });
}

function showQuickActionTab(tabName) {
    // Handle Bahan/Kemasan tabs
    if (tabName === 'bahan' || tabName === 'kemasan') {
        // Hide all content
        document.getElementById('quick-content-bahan').classList.add('hidden');
        document.getElementById('quick-content-kemasan').classList.add('hidden');

        // Deactivate all tabs
        document.getElementById('quick-tab-bahan').classList.remove('bg-blue-50', 'border-blue-600', 'text-blue-600');
        document.getElementById('quick-tab-bahan').classList.add('text-gray-500', 'hover:text-gray-700');
        document.getElementById('quick-tab-kemasan').classList.remove('bg-blue-50', 'border-blue-600', 'text-blue-600');
        document.getElementById('quick-tab-kemasan').classList.add('text-gray-500', 'hover:text-gray-700');

        // Show selected content
        document.getElementById('quick-content-' + tabName).classList.remove('hidden');

        // Activate selected tab
        document.getElementById('quick-tab-' + tabName).classList.add('bg-blue-50', 'border-blue-600', 'text-blue-600');
        document.getElementById('quick-tab-' + tabName).classList.remove('text-gray-500', 'hover:text-gray-700');
    }

    // Handle Overhead/Tenaga Kerja tabs
    if (tabName === 'overhead' || tabName === 'tenaga_kerja') {
        // Hide all content
        document.getElementById('quick-content-overhead').classList.add('hidden');
        document.getElementById('quick-content-tenaga_kerja').classList.add('hidden');

        // Deactivate all tabs
        document.getElementById('quick-tab-overhead').classList.remove('bg-purple-50', 'border-purple-600', 'text-purple-600');
        document.getElementById('quick-tab-overhead').classList.add('text-gray-500', 'hover:text-gray-700');
        document.getElementById('quick-tab-tenaga_kerja').classList.remove('bg-purple-50', 'border-purple-600', 'text-purple-600');
        document.getElementById('quick-tab-tenaga_kerja').classList.add('text-gray-500', 'hover:text-gray-700');

        // Show selected content
        document.getElementById('quick-content-' + tabName).classList.remove('hidden');

        // Activate selected tab
        const activeColor = tabName === 'overhead' ? 'purple' : 'orange';
        document.getElementById('quick-tab-' + tabName).classList.add(`bg-${activeColor}-50`, `border-${activeColor}-600`, `text-${activeColor}-600`);
        document.getElementById('quick-tab-' + tabName).classList.remove('text-gray-500', 'hover:text-gray-700');
    }
}

// assets/js/resep_produk.js
// Script untuk menangani form resep produk

document.addEventListener('DOMContentLoaded', function() {
    // Format input currency
    const currencyInputs = document.querySelectorAll('input[data-currency]');
    currencyInputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = this.value.replace(/[^\d]/g, '');
            if (value) {
                this.value = 'Rp ' + new Intl.NumberFormat('id-ID').format(value);
            }
        });
    });

    // Update unit select based on raw material selection
    const rawMaterialSelects = document.querySelectorAll('select[name="raw_material_id"]');
    rawMaterialSelects.forEach(select => {
        select.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const unit = selectedOption.getAttribute('data-unit');
            const unitSelect = this.closest('form').querySelector('select[name="unit"]');

            if (unit && unitSelect) {
                // Set the unit to match the raw material's unit
                for (let option of unitSelect.options) {
                    if (option.value === unit) {
                        option.selected = true;
                        break;
                    }
                }
            }
        });
    });
});

// Function untuk switch tab bahan baku & kemasan
function switchTab(tabName, buttonElement) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.add('hidden');
    });

    // Remove active state from all buttons
    const tabButtons = buttonElement.parentElement.querySelectorAll('button');
    tabButtons.forEach(button => {
        button.classList.remove('text-blue-600', 'border-b-2', 'border-blue-500', 'bg-white');
        button.classList.add('text-gray-500', 'hover:text-blue-600', 'bg-blue-50');
    });

    // Show selected tab content
    const selectedContent = document.getElementById(tabName + '-content');
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
    }

    // Add active state to clicked button
    buttonElement.classList.remove('text-gray-500', 'hover:text-blue-600', 'bg-blue-50');
    buttonElement.classList.add('text-blue-600', 'border-b-2', 'border-blue-500', 'bg-white');
}

// Function untuk switch tab overhead & tenaga kerja
function switchOverheadTab(tabName, buttonElement) {
    // Hide all overhead tab contents
    const tabContents = document.querySelectorAll('.overhead-tab-content');
    tabContents.forEach(content => {
        content.classList.add('hidden');
    });

    // Remove active state from all buttons
    const tabButtons = buttonElement.parentElement.querySelectorAll('button');
    tabButtons.forEach(button => {
        button.classList.remove('text-purple-600', 'border-b-2', 'border-purple-500', 'bg-white');
        button.classList.add('text-gray-500', 'hover:text-purple-600', 'bg-purple-50');
    });

    // Show selected tab content
    const selectedContent = document.getElementById(tabName + '-content');
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
    }

    // Add active state to clicked button
    buttonElement.classList.remove('text-gray-500', 'hover:text-purple-600', 'bg-purple-50');
    buttonElement.classList.add('text-purple-600', 'border-b-2', 'border-purple-500', 'bg-white');
}

// Function to handle recipe deletion
function deleteRecipe(recipeId, materialName) {
    if (confirm(`Apakah Anda yakin ingin menghapus ${materialName} dari resep?`)) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/cornerbites-sia/process/simpan_resep_produk.php';

        const actionInput = document.createElement('input');
        actionInput.type = 'hidden';
        actionInput.name = 'action';
        actionInput.value = 'delete_recipe';

        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.name = 'recipe_id';
        idInput.value = recipeId;

        form.appendChild(actionInput);
        form.appendChild(idInput);
        document.body.appendChild(form);
        form.submit();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Restore scroll position after page load
    const savedScrollPosition = sessionStorage.getItem('resepScrollPosition');
    if (savedScrollPosition) {
        setTimeout(() => {
            window.scrollTo(0, parseInt(savedScrollPosition));
            sessionStorage.removeItem('resepScrollPosition');
        }, 100);
    }

    // Real-time search untuk resep
    const searchInputRecipe = document.getElementById('search_recipe');
    const limitSelectRecipe = document.getElementById('recipe_limit');
    const sectionFilterRecipe = document.getElementById('section_filter');

    if (searchInputRecipe && limitSelectRecipe && sectionFilterRecipe) {
        searchInputRecipe.addEventListener('input', function() {
            clearTimeout(searchTimeoutRecipe);
            searchTimeoutRecipe = setTimeout(function() {
                currentScrollPosition = window.pageYOffset;
                sessionStorage.setItem('resepScrollPosition', currentScrollPosition);
                updateRecipeResults();
            }, 300);
        });

        limitSelectRecipe.addEventListener('change', function() {
            clearTimeout(limitTimeoutRecipe);
            limitTimeoutRecipe = setTimeout(function() {
                currentScrollPosition = window.pageYOffset;
                sessionStorage.setItem('resepScrollPosition', currentScrollPosition);
                updateRecipeResults();
            }, 100);
        });

        sectionFilterRecipe.addEventListener('change', function() {
            clearTimeout(limitTimeoutRecipe);
            limitTimeoutRecipe = setTimeout(function() {
                currentScrollPosition = window.pageYOffset;
                sessionStorage.setItem('resepScrollPosition', currentScrollPosition);
                updateRecipeResults();
            }, 100);
        });
    }

    // Add form validation to recipe form
    const recipeForm = document.querySelector('form[action="../process/simpan_resep_produk.php"]');
    if (recipeForm && !recipeForm.querySelector('input[name="action"]')) {
        recipeForm.addEventListener('submit', function(e) {
            if (!validateRecipeForm()) {
                e.preventDefault();
                return false;
            }
        });
    }

    // Initialize with bahan tab active
    if (document.getElementById('tab-bahan')) {
        showCategoryTab('bahan');
    }

    console.log('Resep Produk page loaded');
});
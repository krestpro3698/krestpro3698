// Application state
const appState = {
    currentStage: 0,
    profile: {},
    selectedCar: null,
    vinCheck: null,
    inspection: {},
    results: {}
};

// Stage configuration
const stages = [
    { name: "Анкета", description: "Выявление потребностей", icon: "📋" },
    { name: "Поиск", description: "Поиск вариантов", icon: "🔍" },
    { name: "Проверка", description: "Верификация", icon: "✓" },
    { name: "Осмотр", description: "Диагностика", icon: "🔧" },
    { name: "Результат", description: "Итоговый отчет", icon: "📊" }
];

// Sample car data
const cars = [
    { brand: "Toyota", model: "Camry", year: 2018, price: 1200000, mileage: 120000, rating: 4.5 },
    { brand: "Honda", model: "Accord", year: 2017, price: 1100000, mileage: 135000, rating: 4.3 },
    { brand: "BMW", model: "3 Series", year: 2016, price: 950000, mileage: 150000, rating: 4.0 },
    { brand: "Volkswagen", model: "Passat", year: 2015, price: 750000, mileage: 180000, rating: 3.8 },
    { brand: "Mazda", model: "6", year: 2019, price: 1350000, mileage: 95000, rating: 4.7 },
    { brand: "Skoda", model: "Superb", year: 2017, price: 890000, mileage: 140000, rating: 4.2 },
    { brand: "Hyundai", model: "Sonata", year: 2018, price: 950000, mileage: 110000, rating: 4.1 }
];

// Текущий отфильтрованный список автомобилей
let currentFilteredCars = [...cars];

// Checklist categories
const checklistData = {
    "Кузов": [
        "Лакокрасочное покрытие",
        "Ржавчина",
        "Деформации",
        "Целостность панелей"
    ],
    "Стекла": [
        "Лобовое стекло",
        "Боковые стекла",
        "Задние стекла"
    ],
    "Двигатель": [
        "Запуск холодный",
        "Шумы двигателя",
        "Дымность выхлопа",
        "Утечки жидкостей"
    ],
    "Подвеска": [
        "Амортизаторы",
        "Стойки",
        "Шаровые опоры"
    ],
    "Электрика": [
        "Фары",
        "Стеклоочистители",
        "Кондиционер",
        "Музыкальная система"
    ],
    "Салон": [
        "Состояние сидений",
        "Обивка дверей",
        "Потолок",
        "Коврики"
    ],
    "Колёса": [
        "Протектор шин",
        "Целостность дисков",
        "Люфт в подшипниках"
    ]
};

let priceChart = null;

// Initialize app
function init() {
    renderStageCards();
    updateProgress();
    renderCarsTable();
    renderChecklist();
    createPriceChart();
}

// Render stage cards
function renderStageCards() {
    const container = document.getElementById('stageCards');
    container.innerHTML = stages.map((stage, index) => `
        <div class="stage-card ${index === appState.currentStage ? 'active' : ''}" onclick="switchStage(${index})">
            <div class="stage-icon">${stage.icon}</div>
            <div class="stage-name">${stage.name}</div>
            <div class="stage-desc">${stage.description}</div>
        </div>
    `).join('');
}

// Switch between stages
function switchStage(index) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`tab-${index}`).classList.add('active');
    
    // Update stage
    appState.currentStage = index;
    renderStageCards();
    updateProgress();
    
    // Load data for specific stages
    if (index === 4) {
        generateFinalReport();
    }
}

// Update progress bar
function updateProgress() {
    const progress = ((appState.currentStage + 1) / stages.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

// Save profile (Tab 1)
function saveProfile() {
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    const budget = document.getElementById('budget').value;
    
    if (!name || !budget) {
        alert('Пожалуйста, заполните обязательные поля: Имя и Бюджет');
        return;
    }
    
    const bodyTypes = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
        bodyTypes.push(cb.value);
    });
    
    const transmission = document.querySelector('input[name="transmission"]:checked')?.value || '';
    
    appState.profile = {
        name,
        phone,
        budget,
        bodyTypes,
        carAge: document.getElementById('carAge').value,
        transmission,
        priorities: {
            price: document.getElementById('priorityPrice').value,
            reliability: document.getElementById('priorityReliability').value,
            comfort: document.getElementById('priorityComfort').value,
            economy: document.getElementById('priorityEconomy').value
        }
    };
    
    alert('Профиль сохранен! Переходим к поиску автомобилей.');
    switchStage(1);
}

// Render cars table (Tab 2)
function renderCarsTable(filteredCars) {
    // Обновляем текущий отфильтрованный список
    if (filteredCars) {
        currentFilteredCars = filteredCars;
    } else if (currentFilteredCars.length === 0) {
        currentFilteredCars = [...cars];
    }
    
    const tbody = document.getElementById('carsTableBody');
    tbody.innerHTML = currentFilteredCars.map((car, index) => `
        <tr>
            <td>${car.brand}</td>
            <td>${car.model}</td>
            <td>${car.year}</td>
            <td>${car.price.toLocaleString()} руб.</td>
            <td>${car.mileage.toLocaleString()} км</td>
            <td class="rating">${'★'.repeat(Math.floor(car.rating))}${'☆'.repeat(5 - Math.floor(car.rating))} ${car.rating}</td>
            <td><button class="btn" style="padding: var(--space-6) var(--space-12); font-size: var(--font-size-sm);" onclick="selectCar(${index})">Выбрать</button></td>
        </tr>
    `).join('');
}

// Apply filters
function applyFilters() {
    const priceFrom = parseInt(document.getElementById('priceFrom').value) || 0;
    const priceTo = parseInt(document.getElementById('priceTo').value) || Infinity;
    const yearFrom = parseInt(document.getElementById('yearFrom').value) || 0;
    const mileageTo = parseInt(document.getElementById('mileageTo').value) || Infinity;
    
    currentFilteredCars = cars.filter(car => 
        car.price >= priceFrom && 
        car.price <= priceTo && 
        car.year >= yearFrom && 
        car.mileage <= mileageTo
    );
    
    renderCarsTable(currentFilteredCars);
}

// Select car
function selectCar(index) {
    if (index >= 0 && index < currentFilteredCars.length) {
        appState.selectedCar = currentFilteredCars[index];
        alert(`Выбран автомобиль: ${currentFilteredCars[index].brand} ${currentFilteredCars[index].model} ${currentFilteredCars[index].year}\nПереходим к проверке VIN`);
        switchStage(2);
    } else {
        alert('Ошибка: не удалось выбрать автомобиль');
    }
}

// Create price chart
function createPriceChart() {
    const ctx = document.getElementById('priceChart');
    if (!ctx) return;
    
    const labels = cars.map(car => `${car.brand} ${car.model}`);
    const data = cars.map(car => car.price / 1000);
    
    if (priceChart) {
        priceChart.destroy();
    }
    
    priceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Цена (тыс. руб.)',
                data: data,
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C'],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Распределение цен'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Цена (тыс. руб.)'
                    }
                }
            }
        }
    });
}

// Check VIN (Tab 3)
function checkVIN() {
    const vin = document.getElementById('vinNumber').value;
    
    if (vin.length !== 17) {
        alert('VIN должен содержать 17 символов');
        return;
    }
    
    // Simulate VIN check
    const riskScore = Math.floor(Math.random() * 10) + 1;
    const hasAccidents = riskScore > 6;
    const ownersCount = Math.floor(Math.random() * 4) + 1;
    const hasLiens = riskScore > 8;
    const wasTaxi = riskScore > 7;
    
    appState.vinCheck = {
        vin,
        riskScore,
        hasAccidents,
        ownersCount,
        hasLiens,
        wasTaxi
    };
    
    // Display results
    document.getElementById('vinResult').style.display = 'block';
    document.getElementById('accidentHistory').textContent = hasAccidents ? 'Найдены ДТП' : 'Не зафиксировано';
    document.getElementById('ownersCount').textContent = ownersCount;
    document.getElementById('liens').textContent = hasLiens ? 'Обнаружены' : 'Не обнаружены';
    document.getElementById('mileageHistory').textContent = 'Совпадает с заявленным';
    document.getElementById('taxiUse').textContent = wasTaxi ? 'Да' : 'Нет';
    document.getElementById('riskScore').textContent = `${riskScore}/10`;
    
    // Update risk indicator
    const indicator = document.getElementById('riskIndicator');
    indicator.style.left = `${(riskScore / 10) * 100}%`;
    
    // Update result box class
    const resultBox = document.getElementById('checkResultBox');
    resultBox.className = 'check-result';
    
    let status = '';
    if (riskScore <= 3) {
        resultBox.classList.add('success');
        status = '✓ Чист - рекомендуется к покупке';
    } else if (riskScore <= 6) {
        resultBox.classList.add('warning');
        status = '⚠ Требует внимания - возможны риски';
    } else {
        resultBox.classList.add('danger');
        status = '✗ Не рекомендуется - высокие риски';
    }
    
    document.getElementById('finalStatus').textContent = status;
}

// Render checklist (Tab 4)
function renderChecklist() {
    const container = document.getElementById('checklistContainer');
    
    container.innerHTML = Object.entries(checklistData).map(([category, items]) => `
        <div class="checklist-category">
            <h3>${category}</h3>
            ${items.map((item, index) => `
                <div class="checklist-item">
                    <label>${item}</label>
                    <select class="checklist-select" data-category="${category}" data-item="${item}">
                        <option value="3">Хорошо</option>
                        <option value="2">Удовлетворительно</option>
                        <option value="1">Плохо</option>
                        <option value="0" selected>Не проверено</option>
                    </select>
                </div>
            `).join('')}
        </div>
    `).join('');
}

// Calculate condition score
function calculateCondition() {
    const selects = document.querySelectorAll('.checklist-select');
    let total = 0;
    let count = 0;
    
    appState.inspection = {};
    
    selects.forEach(select => {
        const value = parseInt(select.value);
        const category = select.dataset.category;
        const item = select.dataset.item;
        
        if (!appState.inspection[category]) {
            appState.inspection[category] = {};
        }
        appState.inspection[category][item] = value;
        
        if (value > 0) {
            total += value;
            count++;
        }
    });
    
    const score = count > 0 ? Math.round((total / (count * 3)) * 100) : 0;
    document.getElementById('conditionScore').textContent = score;
    
    appState.results.conditionScore = score;
    
    alert(`Оценка состояния рассчитана: ${score}/100`);
}

// Generate final report (Tab 5)
function generateFinalReport() {
    const conditionScore = appState.results.conditionScore || 0;
    const riskScore = appState.vinCheck?.riskScore || 5;
    const legalScore = riskScore <= 3 ? 9 : (riskScore <= 6 ? 6 : 3);
    const historyScore = 10 - riskScore;
    
    // Calculate overall recommendation
    const avgScore = (conditionScore + legalScore * 10 + historyScore * 10) / 3;
    
    const recommendation = document.getElementById('finalRecommendation');
    recommendation.className = 'recommendation';
    
    if (avgScore >= 70) {
        recommendation.classList.add('success');
        recommendation.textContent = '✓ Рекомендуем к покупке';
    } else if (avgScore >= 50) {
        recommendation.classList.add('warning');
        recommendation.textContent = '⚠ Требует дополнительных условий';
    } else {
        recommendation.classList.add('danger');
        recommendation.textContent = '✗ Не рекомендуем к покупке';
    }
    
    // Update summary table
    document.getElementById('techScore').textContent = `${conditionScore}/100`;
    document.getElementById('techStatus').textContent = conditionScore >= 70 ? '✓ Хорошо' : (conditionScore >= 50 ? '⚠ Удовл.' : '✗ Плохо');
    
    document.getElementById('legalScore').textContent = `${legalScore}/10`;
    document.getElementById('legalStatus').textContent = legalScore >= 7 ? '✓ Чист' : (legalScore >= 5 ? '⚠ Внимание' : '✗ Риски');
    
    document.getElementById('historyScore').textContent = `${historyScore}/10`;
    document.getElementById('historyStatus').textContent = historyScore >= 7 ? '✓ Хорошо' : (historyScore >= 5 ? '⚠ Удовл.' : '✗ Плохо');
    
    const matchScore = Math.floor(Math.random() * 3) + 7;
    document.getElementById('matchScore').textContent = `${matchScore}/10`;
    document.getElementById('matchStatus').textContent = '✓ Соответствует';
    
    // Calculate costs
    const purchasePrice = appState.selectedCar?.price || 1000000;
    const repairCost = conditionScore >= 70 ? 50000 : (conditionScore >= 50 ? 150000 : 300000);
    const regCost = 15000;
    const totalCost = purchasePrice + repairCost + regCost;
    
    document.getElementById('purchasePrice').textContent = purchasePrice.toLocaleString() + ' руб.';
    document.getElementById('repairCost').textContent = repairCost.toLocaleString() + ' руб.';
    document.getElementById('totalCost').textContent = totalCost.toLocaleString() + ' руб.';
}

// Download report
function downloadReport() {
    alert('Функция генерации PDF-отчета будет доступна в полной версии системы.\n\nОтчет будет содержать:\n- Анкетные данные клиента\n- Список проверенных автомобилей\n- Результаты VIN-проверки\n- Детальный чек-лист осмотра\n- Финальные рекомендации\n- Расчет стоимости');
}

// Reset app
function resetApp() {
    if (confirm('Вы уверены, что хотите начать сначала? Все данные будут удалены.')) {
        // Reset state
        appState.currentStage = 0;
        appState.profile = {};
        appState.selectedCar = null;
        appState.vinCheck = null;
        appState.inspection = {};
        appState.results = {};
        
        // Сбрасываем отфильтрованный список
        currentFilteredCars = [...cars];
        
        // Clear forms
        document.getElementById('clientName').value = '';
        document.getElementById('clientPhone').value = '';
        document.getElementById('budget').value = '';
        document.getElementById('carAge').value = 5;
        document.getElementById('ageValue').textContent = '5';
        document.getElementById('vinNumber').value = '';
        document.getElementById('vinResult').style.display = 'none';
        document.getElementById('specialistComments').value = '';
        document.getElementById('conditionScore').textContent = '0';
        
        // Reset checkboxes and radios
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('input[type="radio"]').forEach(rb => rb.checked = false);
        
        // Reset checklist
        document.querySelectorAll('.checklist-select').forEach(select => select.value = '0');
        
        // Обновляем таблицу
        renderCarsTable();
        
        // Switch to first stage
        switchStage(0);
        
        alert('Система сброшена. Начните с заполнения анкеты.');
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', init);
// script.js
let totalRevenue = 0;
let totalCost = 0;

function formatPrice(number) {
    return number.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\s/g, ',');
}

function updateTotals() {
    document.getElementById('total').innerHTML = `${formatPrice(totalRevenue)} ₽`;
    document.getElementById('totalCost').innerHTML = `${formatPrice(totalCost)} ₽`;
    const profit = totalRevenue - totalCost;
    document.getElementById('totalProfit').innerHTML = `${formatPrice(profit)} ₽`;
    const margin = totalRevenue > 0 ? (profit / totalRevenue * 100).toFixed(1) : 0;
    document.getElementById('totalMargin').innerHTML = `${margin}%`;
    
    // Ваши 7% от прибыли
    const yourCut = profit * 0.07;
    document.getElementById('yourCut').innerHTML = `${formatPrice(yourCut)} ₽`;
}

function addToChat(text, revenue, cost) {
    const chat = document.getElementById('chat');
    
    // Удаляем пустое сообщение, если оно есть
    if (chat.children.length === 1 && chat.children[0].classList?.contains('empty-cart-message')) {
        chat.innerHTML = '';
        chat.style.counterReset = 'item-counter';
    }
    
    const message = document.createElement('div');
    message.className = 'message-numbered';
    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue * 100).toFixed(1) : 0;
    message.textContent = `${text} — ${formatPrice(revenue)} ₽ (себ.: ${formatPrice(cost)} ₽, прибыль: ${formatPrice(profit)} ₽, маржа: ${margin}%)`;
    chat.appendChild(message);
    
    totalRevenue += revenue;
    totalCost += cost;
    updateTotals();
    chat.scrollTop = chat.scrollHeight;
}

// Только выручка (без себестоимости) для бригадиров
function addRevenueOnly(name, revenue) {
    const chat = document.getElementById('chat');
    
    if (chat.children.length === 1 && chat.children[0].classList?.contains('empty-cart-message')) {
        chat.innerHTML = '';
        chat.style.counterReset = 'item-counter';
    }
    
    const message = document.createElement('div');
    message.className = 'message-numbered';
    message.textContent = `${name} — ${formatPrice(revenue)} ₽`;
    chat.appendChild(message);
    
    totalRevenue += revenue;
    updateTotals();
    chat.scrollTop = chat.scrollHeight;
}

function addWithMargin(name, revenue, cost) {
    addToChat(name, revenue, cost);
}

// ========== ФУНКЦИИ ДЛЯ ТЕХНИКИ С КОЛИЧЕСТВОМ ==========

// Для техники (трактор, мини-техника, самосвал) - с себестоимостью
function addTechWithCount(name, pricePerUnit, costPerUnit, countId, unitLabel = 'смена') {
    const count = parseFloat(document.getElementById(countId).value);
    if (isNaN(count) || count <= 0) {
        showAlert('Пожалуйста, введите корректное количество (больше 0)');
        return;
    }
    const revenue = pricePerUnit * count;
    const cost = costPerUnit * count;
    addToChat(`${name} (${formatPrice(pricePerUnit)} ₽/${unitLabel} × ${count} ${unitLabel})`, revenue, cost);
    document.getElementById(countId).value = 1;
}

// Для бригадира (без себестоимости) с количеством
function addBrigadirWithCount(name, pricePerUnit, countId) {
    const count = parseFloat(document.getElementById(countId).value);
    if (isNaN(count) || count <= 0) {
        showAlert('Пожалуйста, введите корректное количество смен (больше 0)');
        return;
    }
    const revenue = pricePerUnit * count;
    addToChat(`${name} (${formatPrice(pricePerUnit)} ₽/смена × ${count} смен)`, revenue, 0);
    document.getElementById(countId).value = 1;
}

// ========== ОСТАЛЬНЫЕ ФУНКЦИИ ==========

function addWithCustomMargin(prefix, priceId, costId) {
    const price = parseFloat(document.getElementById(priceId).value);
    const cost = parseFloat(document.getElementById(costId).value);
    
    if (isNaN(price) || price <= 0) {
        showAlert('Пожалуйста, введите корректную цену для клиента (больше 0)');
        return;
    }
    if (isNaN(cost) || cost < 0) {
        showAlert('Пожалуйста, введите корректную себестоимость (0 или больше)');
        return;
    }
    
    addToChat(prefix, price, cost);
    document.getElementById(priceId).value = '';
    document.getElementById(costId).value = '';
}

// Для сыпучих материалов (себестоимость = 75% от цены)
function addVolumeWithAutoCost(prefix, volumeId, pricePerUnit) {
    const volume = parseFloat(document.getElementById(volumeId).value);
    
    if (isNaN(volume) || volume <= 0) {
        showAlert('Пожалуйста, введите корректный объём (больше 0)');
        return;
    }
    
    const revenue = pricePerUnit * volume;
    const cost = revenue * 0.75;
    addToChat(`${prefix} (${formatPrice(pricePerUnit)} ₽/м³ × ${volume} м³)`, revenue, cost);
    document.getElementById(volumeId).value = '';
}

// Брусчатка на песчано-щебневом основании
function addPavingSandWithMargin() {
    const area = parseFloat(document.getElementById('pavingSandArea').value);
    const pricePerUnit = 7500;
    const margin = 0.40;
    
    if (isNaN(area) || area <= 0) {
        showAlert('Пожалуйста, введите корректную площадь (больше 0)');
        return;
    }
    
    const revenue = pricePerUnit * area;
    const cost = revenue * (1 - margin);
    addToChat(`Брусчатка на песчано-щебневом основании под ключ (${formatPrice(pricePerUnit)} ₽/м² × ${area} м²)`, revenue, cost);
    document.getElementById('pavingSandArea').value = '';
}

// Брусчатка на бетонном основании
function addPavingConcreteWithMargin() {
    const area = parseFloat(document.getElementById('pavingConcreteArea').value);
    const pricePerUnit = 10000;
    const margin = 0.40;
    
    if (isNaN(area) || area <= 0) {
        showAlert('Пожалуйста, введите корректную площадь (больше 0)');
        return;
    }
    
    const revenue = pricePerUnit * area;
    const cost = revenue * (1 - margin);
    addToChat(`Брусчатка на бетонном основании (${formatPrice(pricePerUnit)} ₽/м² × ${area} м²)`, revenue, cost);
    document.getElementById('pavingConcreteArea').value = '';
}

// Песчано-щебневая дорога
function addGravelRoadWithMargin() {
    const area = parseFloat(document.getElementById('gravelRoadArea').value);
    const pricePerUnit = 4000;
    const margin = 0.45;
    
    if (isNaN(area) || area <= 0) {
        showAlert('Пожалуйста, введите корректную площадь (больше 0)');
        return;
    }
    
    const revenue = pricePerUnit * area;
    const cost = revenue * (1 - margin);
    addToChat(`Песчано-щебневая дорога/парковка (${formatPrice(pricePerUnit)} ₽/м² × ${area} м²)`, revenue, cost);
    document.getElementById('gravelRoadArea').value = '';
}

// Бетонное основание
function addConcreteBaseWithMargin() {
    const area = parseFloat(document.getElementById('concreteBaseArea').value);
    const pricePerUnit = 6000;
    const margin = 0.40;
    
    if (isNaN(area) || area <= 0) {
        showAlert('Пожалуйста, введите корректную площадь (больше 0)');
        return;
    }
    
    const revenue = pricePerUnit * area;
    const cost = revenue * (1 - margin);
    addToChat(`Бетонное основание/отмостка (${formatPrice(pricePerUnit)} ₽/м² × ${area} м²)`, revenue, cost);
    document.getElementById('concreteBaseArea').value = '';
}

// Для работ по площади (штуки/сотки/м²)
function addAreaBasedWithMargin(name, priceId, costId, areaId, unit = 'м²') {
    const price = parseFloat(document.getElementById(priceId).value);
    const cost = parseFloat(document.getElementById(costId).value);
    const area = parseFloat(document.getElementById(areaId).value);
    
    if (isNaN(price) || price <= 0) {
        showAlert(`Пожалуйста, введите корректную цену за ${unit} (больше 0)`);
        return;
    }
    if (isNaN(cost) || cost < 0) {
        showAlert(`Пожалуйста, введите корректную себестоимость за ${unit}`);
        return;
    }
    if (isNaN(area) || area <= 0) {
        showAlert(`Пожалуйста, введите корректное количество ${unit} (больше 0)`);
        return;
    }
    
    const revenue = price * area;
    const totalCost = cost * area;
    const unitLabel = unit === 'сотка' ? getSotkaLabel(area) : unit;
    addToChat(`${name} (${formatPrice(price)} ₽/${unitLabel} × ${area} ${unitLabel})`, revenue, totalCost);
    document.getElementById(areaId).value = '';
}

function getSotkaLabel(number) {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'соток';
    if (lastDigit === 1) return 'сотка';
    if (lastDigit >= 2 && lastDigit <= 4) return 'сотки';
    return 'соток';
}

// Посевной газон (ИСПРАВЛЕННЫЙ)
function addSeededLawnButton() {
    const price = parseFloat(document.getElementById('seededLawnPrice').value);
    const cost = parseFloat(document.getElementById('seededLawnCost').value);
    const area = parseFloat(document.getElementById('seededLawnArea').value);
    
    if (isNaN(price) || price <= 0) {
        showAlert('Пожалуйста, введите корректную цену за м² (больше 0)');
        return;
    }
    if (isNaN(cost) || cost < 0) {
        showAlert('Пожалуйста, введите корректную себестоимость за м²');
        return;
    }
    if (isNaN(area) || area <= 0) {
        showAlert('Пожалуйста, введите корректную площадь (больше 0)');
        return;
    }
    
    const revenue = price * area;
    const totalCostValue = cost * area;  // Переименовал, чтобы не конфликтовать с глобальной переменной
    
    const description = `Посевной газон под ключ (${formatPrice(price)} ₽/м² × ${area} м²) — ${formatPrice(revenue)} ₽\n   • Фрезеровка участка в два прохода + выравнивание участка\n   • доставка, отсыпка, и распределение плодородного грунта (поднятие на 5см)\n   • травосмесь премиум\n   • посев в 2 прохода + ручное выравнивание\n   • укатка грунта\n   • заделка семян\n   • Посев семян`;
    
    const chat = document.getElementById('chat');
    if (chat.children.length === 1 && chat.children[0].classList?.contains('empty-cart-message')) {
        chat.innerHTML = '';
        chat.style.counterReset = 'item-counter';
    }
    
    const message = document.createElement('div');
    message.className = 'message-numbered';
    const profit = revenue - totalCostValue;
    const margin = revenue > 0 ? (profit / revenue * 100).toFixed(1) : 0;
    message.textContent = `${description} (себ.: ${formatPrice(totalCostValue)} ₽, прибыль: ${formatPrice(profit)} ₽, маржа: ${margin}%)`;
    chat.appendChild(message);
    
    // Обновляем глобальные переменные
    totalRevenue += revenue;
    totalCost += totalCostValue;
    
    console.log('Добавлено: выручка=' + revenue + ', себест=' + totalCostValue);
    console.log('Всего: выручка=' + totalRevenue + ', себест=' + totalCost);
    
    updateTotals();
    chat.scrollTop = chat.scrollHeight;
    
    document.getElementById('seededLawnArea').value = '';
}

// Рулонный газон (ИСПРАВЛЕННЫЙ)
function addRolledLawnButton() {
    const price = parseFloat(document.getElementById('rolledLawnPrice').value);
    const cost = parseFloat(document.getElementById('rolledLawnCost').value);
    const area = parseFloat(document.getElementById('rolledLawnArea').value);
    
    if (isNaN(price) || price <= 0) {
        showAlert('Пожалуйста, введите корректную цену за м² (больше 0)');
        return;
    }
    if (isNaN(cost) || cost < 0) {
        showAlert('Пожалуйста, введите корректную себестоимость за м²');
        return;
    }
    if (isNaN(area) || area <= 0) {
        showAlert('Пожалуйста, введите корректную площадь (больше 0)');
        return;
    }
    
    const revenue = price * area;
    const totalCostValue = cost * area;
    
    const description = `Рулонный газон под ключ (${formatPrice(price)} ₽/м² × ${area} м²) — ${formatPrice(revenue)} ₽\n   • Фрезеровка участка в два прохода + выравнивание участка\n   • доставка, отсыпка, и распределение плодородного грунта (поднятие на 5см)\n   • Финальное выравнивание и прикатывание грунтового слоя катком\n   • Укладка/Подрезка рулонного газона\n   • Рулонный газон\n   • Послеукладочные работы`;
    
    const chat = document.getElementById('chat');
    if (chat.children.length === 1 && chat.children[0].classList?.contains('empty-cart-message')) {
        chat.innerHTML = '';
        chat.style.counterReset = 'item-counter';
    }
    
    const message = document.createElement('div');
    message.className = 'message-numbered';
    const profit = revenue - totalCostValue;
    const margin = revenue > 0 ? (profit / revenue * 100).toFixed(1) : 0;
    message.textContent = `${description} (себ.: ${formatPrice(totalCostValue)} ₽, прибыль: ${formatPrice(profit)} ₽, маржа: ${margin}%)`;
    chat.appendChild(message);
    
    // Обновляем глобальные переменные
    totalRevenue += revenue;
    totalCost += totalCostValue;
    
    console.log('Добавлено: выручка=' + revenue + ', себест=' + totalCostValue);
    console.log('Всего: выручка=' + totalRevenue + ', себест=' + totalCost);
    
    updateTotals();
    chat.scrollTop = chat.scrollHeight;
    
    document.getElementById('rolledLawnArea').value = '';
}

// Въездная группа
function addDrivewayButton() {
    const revenue = 125000;
    const cost = 85000;
    const description = `Въездная группа с дренажной трубой — ${formatPrice(revenue)} ₽\n   - Геотекстиль\n   - Слой песка\n   - Труба-300 мм 6 м\n   - Слой песка\n   - Слой щебня\n   - Виброплита\n   - Такелажные работы`;
    
    const chat = document.getElementById('chat');
    if (chat.children.length === 1 && chat.children[0].classList?.contains('empty-cart-message')) {
        chat.innerHTML = '';
        chat.style.counterReset = 'item-counter';
    }
    
    const message = document.createElement('div');
    message.className = 'message-numbered';
    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue * 100).toFixed(1) : 0;
    message.textContent = `${description} (себ.: ${formatPrice(cost)} ₽, прибыль: ${formatPrice(profit)} ₽, маржа: ${margin}%)`;
    chat.appendChild(message);
    
    totalRevenue += revenue;
    totalCost += cost;
    updateTotals();
    chat.scrollTop = chat.scrollHeight;
}

function clearChat() {
    if (confirm('Вы действительно хотите очистить весь расчёт?')) {
        const chat = document.getElementById('chat');
        chat.innerHTML = `<div class="empty-cart-message">
            <i class="fas fa-clipboard-list"></i>
            <p>Добавьте услуги из левой панели</p>
            <span>Нажмите на категорию, чтобы раскрыть список</span>
        </div>`;
        totalRevenue = 0;
        totalCost = 0;
        updateTotals();
        chat.style.counterReset = 'item-counter';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        if (document.body.classList.contains('dark-theme')) {
            themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// ========== АККОРДЕОН ДЛЯ КАТЕГОРИЙ ==========
function toggleCategory(categoryId) {
    const card = document.querySelector(`.category-card[data-category="${categoryId}"]`);
    if (card) {
        card.classList.toggle('open');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Открываем первую категорию по умолчанию
    const firstCard = document.querySelector('.category-card');
    if (firstCard) {
        firstCard.classList.add('open');
    }
    
    // Тёмная тема
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    updateTotals();
});

function copyChatToClipboard() {
    const chat = document.getElementById('chat');
    let textToCopy = 'Предварительный расчёт по Вашему запросу\n\n';
    
    const messages = chat.querySelectorAll('.message-numbered');
    messages.forEach((msg, index) => {
        let messageText = msg.textContent;
        messageText = messageText.replace(/^\d+\.\s*/, '');
        textToCopy += `${index + 1}. ${messageText}\n`;
    });
    
    textToCopy += '\n====================\n';
    textToCopy += `💰 Итого к оплате: ${formatPrice(totalRevenue)} ₽\n`;
    textToCopy += `📊 Себестоимость: ${formatPrice(totalCost)} ₽\n`;
    textToCopy += `💵 Прибыль: ${formatPrice(totalRevenue - totalCost)} ₽\n`;
    textToCopy += `📈 Маржа: ${totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue * 100).toFixed(1) : 0}%\n`;
    textToCopy += `💰 Ваши 7% от прибыли: ${formatPrice((totalRevenue - totalCost) * 0.07)} ₽\n`;
    textToCopy += '====================\n';
    textToCopy += 'Срок исполнения:\n';
    textToCopy += 'Предложение будет действительно в течение 14 дней.';
    
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    textarea.style.position = 'fixed';
    textarea.style.opacity = 0;
    textarea.style.left = '-9999px';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);
    
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => showCopySuccess())
                .catch(() => {
                    document.execCommand('copy');
                    showCopySuccess();
                });
        } else {
            document.execCommand('copy');
            showCopySuccess();
        }
    } catch (err) {
        showCopyManual(textToCopy);
    } finally {
        document.body.removeChild(textarea);
    }
}

function showCopySuccess() {
    const notice = document.getElementById('copyNotice');
    notice.textContent = '✅ Расчёт скопирован!';
    notice.classList.add('show');
    
    setTimeout(() => {
        notice.classList.remove('show');
    }, 2000);
}

function showCopyManual(text) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    modal.style.zIndex = '1000';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.padding = '20px';
    
    const content = document.createElement('div');
    content.style.backgroundColor = 'white';
    content.style.padding = '20px';
    content.style.borderRadius = '12px';
    content.style.maxWidth = '100%';
    content.style.maxHeight = '80vh';
    content.style.overflow = 'auto';
    content.style.width = '100%';
    
    const title = document.createElement('h3');
    title.textContent = 'Скопируйте текст расчёта:';
    title.style.marginTop = '0';
    title.style.marginBottom = '15px';
    content.appendChild(title);
    
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.width = '100%';
    textarea.style.minHeight = '150px';
    textarea.style.marginBottom = '15px';
    textarea.style.padding = '12px';
    textarea.style.border = '1px solid #d1d1d6';
    textarea.style.borderRadius = '8px';
    textarea.style.fontFamily = 'inherit';
    textarea.style.fontSize = '0.95rem';
    content.appendChild(textarea);
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Закрыть';
    closeBtn.style.padding = '12px 20px';
    closeBtn.style.backgroundColor = '#28A745';
    closeBtn.style.color = 'white';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '10px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontWeight = '500';
    closeBtn.style.width = '100%';
    closeBtn.onclick = () => document.body.removeChild(modal);
    content.appendChild(closeBtn);
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    textarea.select();
    textarea.setSelectionRange(0, 99999);
}

function showAlert(message) {
    alert(message);
}

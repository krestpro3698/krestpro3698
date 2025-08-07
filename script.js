let total = 0;

function formatPrice(number) {
    return number.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\s/g, ',');
}

function addSeededLawnButton() {
    const price = parseFloat(document.getElementById('seededLawnPrice').value);
    const area = parseFloat(document.getElementById('seededLawnArea').value);

    if (isNaN(price) || price <= 0) {
        showAlert('Пожалуйста, введите корректную цену за м² (больше 0)');
        return;
    }
    
    if (isNaN(area) || area <= 0) {
        showAlert('Пожалуйста, введите корректную площадь (больше 0)');
        return;
    }
    
    const totalPrice = price * area; // Сумма в рублях
    const description = `Посевной газон под ключ (${price.toLocaleString('ru-RU')} руб/м² × ${area.toLocaleString('ru-RU')} м²) — ${formatPrice(totalPrice)} \n   - Удаление сорняков граблями\n   - Распределение грунта\n   - Выравнивание граблями\n   - Уплотнение\n   - Посев семян\n   - Заделка семян`;
    const message = document.createElement('div');
    message.className = 'message-numbered';
    message.textContent = description;
    message.dataset.type = 'seededLawnDetails'; // Метка для копирования
    document.getElementById('chat').appendChild(message);
    
    total += parseFloat(totalPrice);
    updateTotal();
    document.getElementById('seededLawnArea').value = '';
    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
}

function addRolledLawnButton() {
    const price = parseFloat(document.getElementById('rolledLawnPrice').value);
    const area = parseFloat(document.getElementById('rolledLawnArea').value);
    
    if (isNaN(price) || price <= 0) {
        showAlert('Пожалуйста, введите корректную цену за м² (больше 0)');
        return;
    }
    
    if (isNaN(area) || area <= 0) {
        showAlert('Пожалуйста, введите корректную площадь (больше 0)');
        return;
    }
    
    const totalPrice = price * area; // Сумма в рублях
    const description = `Рулонный газон под ключ (${price.toLocaleString('ru-RU')} руб/м² × ${area.toLocaleString('ru-RU')} м²) — ${formatPrice(totalPrice)} \n   - Доставка\n   - Газон\n   - Укладка / Подрезка\n   - Послеукладочные работы`;
    const message = document.createElement('div');
    message.className = 'message-numbered';
    message.textContent = description;
    message.dataset.type = 'rolledLawnDetails'; // Метка для копирования
    document.getElementById('chat').appendChild(message);
    
    total += parseFloat(totalPrice);
    updateTotal();
    document.getElementById('rolledLawnArea').value = '';
    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
}

function addAreaBased(name, priceId, areaId, unit = 'area') {
    const price = parseFloat(document.getElementById(priceId).value);
    const area = parseFloat(document.getElementById(areaId).value);
    
    if (isNaN(price) || price <= 0) {
        showAlert('Пожалуйста, введите корректную цену за ' + unit + ' (больше 0)');
        return;
    }

    
    if (isNaN(area) || area <= 0) {
        showAlert('Пожалуйста, введите корректную площадь/количество (больше 0)');
        return;
    }
    
    const totalPrice = price * area; // Сумма в рублях
    const unitLabel = unit === 'area' ? 'м²' : getSotkaLabel(area); // Используем функцию для склонения
    addCustom(`${name} (${price.toLocaleString('ru-RU')} руб/${unitLabel} × ${area.toLocaleString('ru-RU')} ${unitLabel}) — ${formatPrice(totalPrice)} `, totalPrice); // Добавляем т.р
    
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
function addVolume(prefix, inputId, unitPrice, unit) {
    const input = document.getElementById(inputId);
    const value = parseFloat(input.value);
    
    if (isNaN(value) || value <= 0) {
        showAlert('Пожалуйста, введите корректное количество (больше 0)');
        return;
    }
    
    const pricePerCubicMeter = unitPrice / 10; // Цена за 1 м³ в рублях (unitPrice за 10 м³)
    const totalPrice = pricePerCubicMeter * value; // Общая стоимость в рублях
    addCustom(`${prefix} (${formatPrice(pricePerCubicMeter)} руб/м³ × ${value.toLocaleString('ru-RU')} м³) — ${formatPrice(totalPrice)}`, totalPrice); // Передаем в рублях
    
    input.value = '';
}
function addPavingSandButton() {
    const price = parseFloat(document.getElementById('pavingSandPrice').value);
    const area = parseFloat(document.getElementById('pavingSandArea').value);
    
    if (isNaN(price) || price <= 0) {
        showAlert('Пожалуйста, введите корректную цену за м² (больше 0)');
        return;
    }
    
    if (isNaN(area) || area <= 0) {
        showAlert('Пожалуйста, введите корректную площадь (больше 0)');
        return;
    }
    
    const totalPrice = price * area; // Сумма в рублях
    const description = `Брусчатка на песчано-щебневом основании (${price.toLocaleString('ru-RU')} руб/м² × ${area.toLocaleString('ru-RU')} м²) — ${formatPrice(totalPrice)} `;
    addCustom(description, totalPrice); // Передаем в рублях
    
    document.getElementById('pavingSandArea').value = '';
}

function addPavingConcreteButton() {
    const price = parseFloat(document.getElementById('pavingConcretePrice').value);
    const area = parseFloat(document.getElementById('pavingConcreteArea').value);
    
    if (isNaN(price) || price <= 0) {
        showAlert('Пожалуйста, введите корректную цену за м² (больше 0)');
        return;
    }
    
    if (isNaN(area) || area <= 0) {
        showAlert('Пожалуйста, введите корректную площадь (больше 0)');
        return;
    }
    
    const totalPrice = price * area; // Сумма в рублях
    const description = `Брусчатка на бетонном основании (${price.toLocaleString('ru-RU')} руб/м² × ${area.toLocaleString('ru-RU')} м²) — ${formatPrice(totalPrice)} `;
    addCustom(description, totalPrice); // Передаем в рублях
    
    document.getElementById('pavingConcreteArea').value = '';
}

function addDrivewayButton() {
    const totalPrice = 125000; // Фиксированная цена в рублях
    const description = `Въездная группа с дренажной трубой — ${formatPrice(totalPrice)}\n   - Геотекстиль\n   - Слой песка\n   - Труба-300 мм 6 м\n   - Слой песка\n   - Слой щебня\n   - Виброплита\n   - Такелажные работы`;
    const message = document.createElement('div');
    message.className = 'message-numbered';
    message.textContent = description;
    message.dataset.type = 'drivewayDetails'; // Метка для копирования
    document.getElementById('chat').appendChild(message);
    
    total += parseFloat(totalPrice);
    updateTotal();
    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
}


function addCustomPrice(prefix, inputId) {
    const input = document.getElementById(inputId);
    const value = parseFloat(input.value);
    
    if (isNaN(value) || value <= 0) {
        showAlert('Пожалуйста, введите корректную сумму (больше 0)');
        return;
    }
    
    addCustom(`${prefix} — ${formatPrice(value)}`, value); // Отображаем и передаем в рублях
    input.value = '';
}

function addCustom(text, price) {
    const chat = document.getElementById('chat');
    
    if (chat.children.length === 1) {
        chat.style.counterReset = 'item-counter';
    }
    
    const message = document.createElement('div');
    message.className = 'message-numbered';
    message.textContent = text;
    chat.appendChild(message);
    
    total += parseFloat(price); // Суммируем в рублях
    updateTotal();
    chat.scrollTop = chat.scrollHeight;
}

function updateTotal() {
    document.getElementById('total').textContent = 'Итого: ' + formatPrice(total); // Отображаем в рублях
}

function clearChat() {
    if (confirm('Вы действительно хотите очистить весь расчёт?')) {
        document.getElementById('chat').innerHTML = '<div class="message">Предварительный расчёт по Вашему запросу:</div>';
        total = 0;
        updateTotal();
        document.getElementById('chat').style.counterReset = 'item-counter';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Загрузка сохраненной темы при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

function copyChatToClipboard() {
    const chat = document.getElementById('chat');
    let textToCopy = 'Предварительный расчёт по Вашему запросу\n\n';
    
    const messages = chat.querySelectorAll('.message-numbered');
    messages.forEach((msg, index) => {
        const messageText = msg.textContent.replace(/^\d+\.\s*/, '');
        if (msg.dataset.type === 'rolledLawnDetails' || msg.dataset.type === 'seededLawnDetails' || msg.dataset.type === 'drivewayDetails') {
            // Извлекаем основную строку до пунктов (до первого \n)
            const mainLine = messageText.split('\n')[0];
            textToCopy += `${index + 1}. ${mainLine} т.р\n`;
            // Добавляем пункты, если они есть
            const details = messageText.split('\n').slice(1).join('\n');
            if (details) {
                textToCopy += `${details}\n`;
            }
        } else {
            textToCopy += `${index + 1}. ${messageText} т.р\n`;
        }
    });
    
    textToCopy += '\n====================\n';
    textToCopy += 'Итого: ' + formatPrice(total) + ' т.р\n';
    textToCopy += 'Срок исполнения:\n';
    textToCopy += 'Итоговая стоимость указана с учетом выполнения всех работ под ключ.\n';
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

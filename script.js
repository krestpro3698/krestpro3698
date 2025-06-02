let total = 0;

function formatPrice(number) {
    return number.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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
    
    const totalPrice = price * area / 1000; // Переводим в т.р
    const description = `Посевной газон под ключ (${price.toLocaleString('ru-RU')} руб/м² × ${area.toLocaleString('ru-RU')} м²) - ${formatPrice(totalPrice)} т.р\n- Удаление сорняков граблями\n- Распределение грунта\n- Выравнивание граблями\n- Уплотнение\n- Посев семян\n- Заделка семян`;
    addCustom(description, totalPrice);
    
    document.getElementById('seededLawnArea').value = '';
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
    
    const totalPrice = price * area / 1000; // Переводим в т.р
    const description = `Рулонный газон под ключ (${price.toLocaleString('ru-RU')} руб/м² × ${area.toLocaleString('ru-RU')} м²) - ${formatPrice(totalPrice)} т.р\n- Доставка\n- Газон\n- Укладка/Подрезка\n- Послеукладочные работы`;
    addCustom(description, totalPrice);
    
    document.getElementById('rolledLawnArea').value = '';
}

function addAreaBased(name, priceId, areaId, unit = 'м²') {
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
    
    const totalPrice = unit === 'м²' ? price * area / 1000 : price * area; // Для м² переводим в т.р
    addCustom(`${name} (${price.toLocaleString('ru-RU')} ${unit === 'м²' ? 'руб/м²' : 'т.р/сотка'} × ${area.toLocaleString('ru-RU')} ${unit}) - ${formatPrice(totalPrice)} т.р`, totalPrice);
    
    document.getElementById(areaId).value = '';
}

function addVolume(prefix, inputId, unitPrice, unit) {
    const input = document.getElementById(inputId);
    const value = parseFloat(input.value);
    
    if (isNaN(value) || value <= 0) {
        showAlert('Пожалуйста, введите корректное количество (больше 0)');
        return;
    }
    
    const pricePerCubicMeter = unitPrice / 10; // Цена за 1 м³ в т.р
    const totalPrice = pricePerCubicMeter * value; // Общая стоимость в т.р
    addCustom(`${prefix} (${unitPrice.toLocaleString('ru-RU')} т.р/10м³ × ${value.toLocaleString('ru-RU')} м³) - ${formatPrice(totalPrice)} т.р`, totalPrice);
    
    input.value = '';
}

function addCustomPrice(prefix, inputId) {
    const input = document.getElementById(inputId);
    const value = parseFloat(input.value);
    
    if (isNaN(value) || value <= 0) {
        showAlert('Пожалуйста, введите корректную сумму (больше 0)');
        return;
    }
    
    addCustom(`${prefix} - ${formatPrice(value)} т.р`, value);
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
    
    total += parseFloat(price); // Убедимся, что price — число
    updateTotal();
    chat.scrollTop = chat.scrollHeight;
}

function updateTotal() {
    document.getElementById('total').textContent = 'Итого: ' + formatPrice(total) + ' т.р';
}

function clearChat() {
    if (confirm('Вы действительно хотите очистить весь расчёт?')) {
        document.getElementById('chat').innerHTML = '<div class="message">Предварительный расчёт по Вашему запросу:</div>';
        total = 0;
        updateTotal();
        document.getElementById('chat').style.counterReset = 'item-counter';
    }
}

function copyChatToClipboard() {
    const chat = document.getElementById('chat');
    let textToCopy = 'Предварительный расчёт по Вашему запросу\n\n';
    
    const messages = chat.querySelectorAll('.message-numbered');
    messages.forEach((msg, index) => {
        const messageText = msg.textContent.replace(/^\d+\.\s*/, '');
        textToCopy += (index + 1) + '. ' + messageText + '\n';
    });
    
    textToCopy += '\n====================\n';
    textToCopy += document.getElementById('total').textContent;
    
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

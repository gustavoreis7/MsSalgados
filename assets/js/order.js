// Sistema de Pedidos MS Salgados - Interface Simples
class OrderSystem {
    constructor() {
        this.orderItems = [];
        this.currentItem = null;
        this.phoneNumber = "5519992326554"; // Número do WhatsApp da empresa

        // Dados dos tipos de pedido
        this.orderTypes = {
            fritos: {
                name: "Salgados Fritos",
                icon: "fas fa-fish",
                options: [
                    { id: "meioCentoFrito", name: "Meio Cento Frito", price: 37.00, quantity: "50 unidades", desc: "50 salgados fritos" },
                    { id: "centoFrito", name: "Cento Frito", price: 67.00, quantity: "100 unidades", desc: "100 salgados fritos" },
                    { id: "centoCru", name: "Cento Cru", price: 60.00, quantity: "100 unidades", desc: "100 salgados crus" },
                    { id: "promo150", name: "150 Salgadinhos", price: 100.00, quantity: "150 unidades", desc: "Promoção especial" }
                ],
                flavors: [
                    "Coxinha",
                    "Enroladinho de Presunto e queijo",
                    "Bolinho de Mandioca com queijo",
                    "Quadrado de Calabresa com queijo",
                    "Risoles de Milho com queijo",
                    "Risoles de Brócolis com queijo",
                    "Risoles de Palmito",
                    "Risoles de Carne",
                    "Mini Pastel de Carne",
                    "Mini Pastel de Frango",
                    "Mini Pastel de Queijo",
                    "Croquete",
                    "Quibe",
                    "Bolinha de queijo",
                    "Risoles de Caturpiry"
                ]
            },
            assados: {
                name: "Salgados Assados",
                icon: "fas fa-bread-slice",
                options: [
                    { id: "meioCento", name: "Meio Cento", price: 50.00, quantity: "50 unidades", desc: "50 salgados assados" },
                    { id: "cento", name: "Cento", price: 95.00, quantity: "100 unidades", desc: "100 salgados assados" }
                ],
                flavors: [
                    "Esfirra de Carne",
                    "Tortinhas de Frango com Caturpiry",
                    "Empadas de Palmito",
                    "Tortinha de Brócolis com queijo",
                    "Empadas de Frango",
                    "Tortinha de Palmito",
                    "Quiche Quatro Queijo",
                    "Quiche de Alho Poró",
                    "Quiche Presunto e Queijo",
                    "Quiche de Frango",
                    "Quiche Brócolis com Queijo"
                ]
            },
            paozinho: {
                name: "Pãozinho Recheado",
                icon: "fas fa-bun",
                options: [
                    { id: "cento", name: "Cento", price: 95.00, quantity: "100 unidades", desc: "100 pãezinhos" }
                ],
                flavors: [
                    "Pãozinho recheado com paté de cenoura",
                    "Pãozinho recheado com Pate de Frango"
                ]
            },
            miniPizza: {
                name: "Mini Pizza",
                icon: "fas fa-pizza-slice",
                options: [
                    { id: "cento", name: "Cento", price: 100.00, quantity: "100 unidades", desc: "100 mini pizzas" }
                ],
                flavors: [
                    "Mini Pizza Calabresa com queijo",
                    "Mini Pizza de Presunto e queijo",
                    "Mini Pizza de Frango com Caturpiry e queijo"
                ]
            }
        };

        this.init();
    }

    init() {
        this.loadOrderFromStorage();
        this.setupEventListeners();
        this.updateOrderDisplay();
    }

    loadOrderFromStorage() {
        const savedOrder = localStorage.getItem('msSalgadosOrder');
        if (savedOrder) {
            this.orderItems = JSON.parse(savedOrder);
        }
    }

    saveOrderToStorage() {
        localStorage.setItem('msSalgadosOrder', JSON.stringify(this.orderItems));
    }

    setupEventListeners() {
        // Passo 1: Selecionar tipo
        document.querySelectorAll('.type-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                this.selectType(type);
            });
        });

        // Passo 2: Voltar
        document.getElementById('backToStep1').addEventListener('click', () => {
            this.goToStep(1);
        });

        // Passo 3: Voltar e Próximo
        document.getElementById('backToStep2').addEventListener('click', () => {
            this.goToStep(2);
        });

        document.getElementById('nextToStep4').addEventListener('click', () => {
            this.goToStep(4);
        });

        // Passo 3: Limpar sabores
        document.getElementById('clearFlavors').addEventListener('click', () => {
            this.clearSelectedFlavors();
        });

        // Passo 4: Voltar e Adicionar
        document.getElementById('backToStep3').addEventListener('click', () => {
            this.goToStep(3);
        });

        document.getElementById('addToCartBtn').addEventListener('click', () => {
            this.addItemToOrder();
        });

        // Botão Finalizar Pedido
        document.getElementById('finalizeOrderBtn').addEventListener('click', () => {
            this.showCheckoutModal();
        });

        // Modal Checkout
        document.getElementById('closeCheckoutModal').addEventListener('click', () => {
            this.hideCheckoutModal();
        });

        document.getElementById('checkoutModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('checkoutModal')) {
                this.hideCheckoutModal();
            }
        });

        // Steps do Checkout
        document.getElementById('nextToCheckoutStep2').addEventListener('click', () => {
            if (this.validateCheckoutStep1()) {
                this.goToCheckoutStep(2);
            }
        });

        document.getElementById('backToCheckoutStep1').addEventListener('click', () => {
            this.goToCheckoutStep(1);
        });

        document.getElementById('nextToCheckoutStep3').addEventListener('click', () => {
            if (this.validateCheckoutStep2()) {
                this.goToCheckoutStep(3);
            }
        });

        document.getElementById('backToCheckoutStep2').addEventListener('click', () => {
            this.goToCheckoutStep(2);
        });

        // Enviar pedido
        document.querySelector('.btn-submit-order').addEventListener('click', (e) => {
            e.preventDefault();
            this.submitOrder();
        });
    }

    selectType(type) {
        this.currentItem = {
            type: type,
            typeName: this.orderTypes[type].name,
            selectedOption: null,
            selectedFlavors: [],
            notes: ''
        };

        // Atualizar UI do passo 1
        document.querySelectorAll('.type-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');

        // Carregar opções do passo 2
        this.loadQuantityOptions(type);

        // Ir para passo 2
        this.goToStep(2);
    }

    loadQuantityOptions(type) {
        const container = document.getElementById('quantityGrid');
        const options = this.orderTypes[type].options;

        let html = '';
        options.forEach(option => {
            html += `
                <div class="quantity-option" data-option='${JSON.stringify(option)}'>
                    <h4>${option.name}</h4>
                    <div class="quantity-price">R$ ${option.price.toFixed(2).replace('.', ',')}</div>
                    <div class="quantity-desc">${option.quantity}</div>
                    <div class="quantity-desc">${option.desc}</div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Adicionar event listeners
        container.querySelectorAll('.quantity-option').forEach(optionEl => {
            optionEl.addEventListener('click', (e) => {
                // Remover seleção anterior
                container.querySelectorAll('.quantity-option').forEach(el => {
                    el.classList.remove('selected');
                });

                // Adicionar seleção atual
                e.currentTarget.classList.add('selected');

                // Salvar opção selecionada
                const option = JSON.parse(e.currentTarget.dataset.option);
                this.currentItem.selectedOption = option;

                // Ir para passo 3
                setTimeout(() => {
                    this.loadFlavorsSelection(type);
                    this.goToStep(3);
                }, 300);
            });
        });
    }

    loadFlavorsSelection(type) {
        const container = document.getElementById('flavorsGrid');
        const flavors = this.orderTypes[type].flavors;

        let html = '';
        flavors.forEach(flavor => {
            html += `
                <div class="flavor-item" data-flavor="${flavor}">
                    <div class="flavor-check">
                        <i class="fas fa-check"></i>
                    </div>
                    <span>${flavor}</span>
                </div>
            `;
        });

        container.innerHTML = html;

        // Adicionar event listeners
        container.querySelectorAll('.flavor-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const flavor = e.currentTarget.dataset.flavor;
                this.toggleFlavorSelection(flavor, e.currentTarget);
            });
        });
    }

    toggleFlavorSelection(flavor, element) {
        const index = this.currentItem.selectedFlavors.indexOf(flavor);

        if (index === -1) {
            // Verificar limite
            if (this.currentItem.selectedFlavors.length >= 5) {
                this.showNotification('Limite de 5 sabores atingido!', 'error');
                return;
            }

            // Adicionar
            this.currentItem.selectedFlavors.push(flavor);
            element.classList.add('selected');
        } else {
            // Remover
            this.currentItem.selectedFlavors.splice(index, 1);
            element.classList.remove('selected');
        }

        // Atualizar contador e botão
        this.updateFlavorsCounter();
        this.updateNextButton();
    }

    updateFlavorsCounter() {
        const count = this.currentItem.selectedFlavors.length;
        document.getElementById('selectedCount').textContent = `(${count}/5)`;

        // Atualizar lista selecionada
        const container = document.getElementById('selectedList');

        if (count === 0) {
            container.innerHTML = '<p class="empty-message">Nenhum sabor selecionado</p>';
            return;
        }

        let html = '';
        this.currentItem.selectedFlavors.forEach(flavor => {
            html += `
                <div class="selected-flavor">
                    <span>${flavor}</span>
                    <button class="remove-flavor" data-flavor="${flavor}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });

        container.innerHTML = html;

        // Adicionar event listeners para remover
        container.querySelectorAll('.remove-flavor').forEach(button => {
            button.addEventListener('click', (e) => {
                const flavor = e.currentTarget.dataset.flavor;
                this.removeFlavor(flavor);
            });
        });
    }

    removeFlavor(flavor) {
        // Remover do array
        const index = this.currentItem.selectedFlavors.indexOf(flavor);
        if (index > -1) {
            this.currentItem.selectedFlavors.splice(index, 1);
        }

        // Remover seleção visual
        const flavorItems = document.querySelectorAll('.flavor-item');
        flavorItems.forEach(item => {
            if (item.dataset.flavor === flavor) {
                item.classList.remove('selected');
            }
        });

        // Atualizar contador
        this.updateFlavorsCounter();
        this.updateNextButton();
    }

    clearSelectedFlavors() {
        this.currentItem.selectedFlavors = [];

        // Limpar seleção visual
        document.querySelectorAll('.flavor-item').forEach(item => {
            item.classList.remove('selected');
        });

        // Atualizar contador
        this.updateFlavorsCounter();
        this.updateNextButton();
    }

    updateNextButton() {
        const hasFlavors = this.currentItem.selectedFlavors.length > 0;
        document.getElementById('nextToStep4').disabled = !hasFlavors;
    }

    goToStep(stepNumber) {
        // Esconder todos os steps
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`step${i}`).classList.remove('active');
        }

        // Mostrar step atual
        document.getElementById(`step${stepNumber}`).classList.add('active');

        // Atualizar preview no passo 4
        if (stepNumber === 4 && this.currentItem) {
            this.updateStep4Preview();
        }

        // Rolagem suave para o topo da seção
        document.querySelector('#montar-pedido').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    updateStep4Preview() {
        if (!this.currentItem || !this.currentItem.selectedOption) return;

        document.getElementById('previewType').textContent = this.currentItem.typeName;
        document.getElementById('previewQuantity').textContent = this.currentItem.selectedOption.name + " - " + this.currentItem.selectedOption.quantity;
        document.getElementById('previewFlavors').textContent = "Sabores: " + this.currentItem.selectedFlavors.join(', ');
    }

    addItemToOrder() {
        // Validar
        if (!this.currentItem.selectedOption) {
            this.showNotification('Selecione uma quantidade', 'error');
            return;
        }

        if (this.currentItem.selectedFlavors.length === 0) {
            this.showNotification('Selecione pelo menos 1 sabor', 'error');
            return;
        }

        // Adicionar observações
        const notes = document.getElementById('itemNotes').value.trim();
        this.currentItem.notes = notes;

        // Criar item
        const orderItem = {
            id: Date.now(),
            type: this.currentItem.type,
            typeName: this.currentItem.typeName,
            option: this.currentItem.selectedOption.name,
            quantity: this.currentItem.selectedOption.quantity,
            price: this.currentItem.selectedOption.price,
            flavors: [...this.currentItem.selectedFlavors],
            notes: this.currentItem.notes
        };

        // Adicionar à lista
        this.orderItems.push(orderItem);

        // Limpar item atual
        this.currentItem = null;

        // Limpar UI
        this.clearBuilderUI();

        // Atualizar display
        this.updateOrderDisplay();

        // Salvar
        this.saveOrderToStorage();

        // Mostrar notificação
        this.showNotification('Item adicionado ao pedido!', 'success');

        // Voltar para passo 1
        this.goToStep(1);

        // Rolar para o pedido
        setTimeout(() => {
            document.querySelector('#meu-pedido').scrollIntoView({ behavior: 'smooth' });
        }, 500);
    }

    clearBuilderUI() {
        // Limpar seleções
        document.querySelectorAll('.type-card').forEach(card => {
            card.classList.remove('selected');
        });

        document.querySelectorAll('.quantity-option').forEach(option => {
            option.classList.remove('selected');
        });

        document.querySelectorAll('.flavor-item').forEach(item => {
            item.classList.remove('selected');
        });

        // Limpar campos
        document.getElementById('itemNotes').value = '';

        // Resetar contador
        document.getElementById('selectedCount').textContent = '(0/5)';
        document.getElementById('selectedList').innerHTML = '<p class="empty-message">Nenhum sabor selecionado</p>';

        // Desabilitar botão
        document.getElementById('nextToStep4').disabled = true;
    }

    updateOrderDisplay() {
        const container = document.getElementById('orderItemsContainer');
        const totalElement = document.getElementById('orderTotal');
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        const finalizeBtn = document.getElementById('finalizeOrderBtn');

        // Calcular total
        const total = this.orderItems.reduce((sum, item) => sum + item.price, 0);

        // Atualizar totais
        totalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        cartCount.textContent = this.orderItems.length;
        cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

        // Atualizar botão
        finalizeBtn.disabled = this.orderItems.length === 0;

        if (this.orderItems.length === 0) {
            container.innerHTML = `
                <div class="empty-order">
                    <i class="fas fa-shopping-basket fa-3x"></i>
                    <h3>Seu pedido está vazio</h3>
                    <p>Adicione itens do cardápio para começar</p>
                </div>
            `;
            return;
        }

        let html = '';
        this.orderItems.forEach((item, index) => {
            html += `
                <div class="order-item-card">
                    <div class="order-item-header">
                        <div>
                            <div class="order-item-title">${item.typeName}</div>
                            <div class="order-item-quantity">${item.option} - ${item.quantity}</div>
                        </div>
                        <div class="order-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                    </div>
                    
                    <div class="order-item-flavors">
                        <strong>Sabores:</strong> ${item.flavors.join(', ')}
                    </div>
                    
                    ${item.notes ? `
                        <div class="order-item-notes">
                            <strong>Observações:</strong> ${item.notes}
                        </div>
                    ` : ''}
                    
                    <div class="order-item-actions">
                        <button class="btn-remove-order-item" data-index="${index}">
                            <i class="fas fa-trash"></i> Remover
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Adicionar event listeners para remover
        container.querySelectorAll('.btn-remove-order-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.removeOrderItem(index);
            });
        });
    }

    removeOrderItem(index) {
        if (confirm('Remover este item do pedido?')) {
            this.orderItems.splice(index, 1);
            this.updateOrderDisplay();
            this.saveOrderToStorage();
            this.showNotification('Item removido do pedido', 'info');
        }
    }

    showCheckoutModal() {
        this.updateCheckoutSummary();
        this.goToCheckoutStep(1);
        document.getElementById('checkoutModal').classList.add('active');
    }

    hideCheckoutModal() {
        document.getElementById('checkoutModal').classList.remove('active');
    }

    goToCheckoutStep(stepNumber) {
        // Esconder todos os steps
        for (let i = 1; i <= 3; i++) {
            document.getElementById(`checkoutStep${i}`).classList.remove('active');
        }

        // Mostrar step atual
        document.getElementById(`checkoutStep${stepNumber}`).classList.add('active');
    }

    validateCheckoutStep1() {
        const name = document.getElementById('customerName').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();

        if (!name) {
            this.showNotification('Digite seu nome', 'error');
            return false;
        }

        if (!phone) {
            this.showNotification('Digite seu telefone', 'error');
            return false;
        }

        // Validar formato básico de telefone
        const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
        if (!phoneRegex.test(phone)) {
            this.showNotification('Digite um telefone válido', 'error');
            return false;
        }

        return true;
    }

    validateCheckoutStep2() {
        const address = document.getElementById('deliveryAddress').value.trim();

        if (!address) {
            this.showNotification('Digite o endereço de entrega', 'error');
            return false;
        }

        return true;
    }

    updateCheckoutSummary() {
        const container = document.getElementById('checkoutOrderSummary');
        const totalElement = document.getElementById('checkoutTotal');

        // Calcular total
        const total = this.orderItems.reduce((sum, item) => sum + item.price, 0);
        totalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

        let html = '';
        this.orderItems.forEach((item, index) => {
            html += `
                <div class="checkout-order-item">
                    <div><strong>${item.typeName}</strong> - ${item.option}</div>
                    <div style="font-size: 0.9em; color: #666; margin: 5px 0;">
                        Sabores: ${item.flavors.join(', ')}
                    </div>
                    <div style="text-align: right; font-weight: bold;">
                        R$ ${item.price.toFixed(2).replace('.', ',')}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    submitOrder() {
        // Coletar dados
        const name = document.getElementById('customerName').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();
        const address = document.getElementById('deliveryAddress').value.trim();
        const deliveryTime = document.getElementById('deliveryTime').value;
        const paymentMethod = document.getElementById('paymentMethod').value;
        const finalNotes = document.getElementById('finalNotes').value.trim();

        // Criar mensagem
        const message = this.createWhatsAppMessage(name, phone, address, deliveryTime, paymentMethod, finalNotes);

        // Codificar para URL
        const encodedMessage = encodeURIComponent(message);

        // Criar link do WhatsApp
        const whatsappLink = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;

        // Abrir WhatsApp
        window.open(whatsappLink, '_blank');

        // Limpar pedido após envio
        setTimeout(() => {
            this.orderItems = [];
            this.updateOrderDisplay();
            this.saveOrderToStorage();
            this.hideCheckoutModal();
            this.showNotification('Pedido enviado com sucesso!', 'success');
        }, 1000);
    }

    createWhatsAppMessage(name, phone, address, deliveryTime, paymentMethod, finalNotes) {
        const total = this.orderItems.reduce((sum, item) => sum + item.price, 0);

        let message = `🍽️ *PEDIDO MS SALGADOS* 🍽️\n\n`;
        message += `*Cliente:* ${name}\n`;
        message += `*Telefone:* ${phone}\n`;
        message += `*Endereço:* ${address}\n`;

        if (deliveryTime) {
            message += `*Horário Preferencial:* ${deliveryTime}\n`;
        }

        message += `*Forma de Pagamento:* ${paymentMethod}\n\n`;
        message += `*ITENS DO PEDIDO:*\n`;
        message += `══════════════════════\n\n`;

        this.orderItems.forEach((item, index) => {
            message += `*Item ${index + 1}:* ${item.typeName}\n`;
            message += `• ${item.option} (${item.quantity})\n`;
            message += `• Sabores: ${item.flavors.join(', ')}\n`;
            if (item.notes) {
                message += `• Obs: ${item.notes}\n`;
            }
            message += `• Valor: R$ ${item.price.toFixed(2).replace('.', ',')}\n\n`;
        });

        message += `══════════════════════\n`;
        message += `*TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;

        if (finalNotes) {
            message += `*Observações Adicionais:*\n${finalNotes}\n\n`;
        }

        message += `Obrigado pelo pedido! 🥟\n`;
        message += `Seu pedido será preparado assim que confirmado.`;

        return message;
    }

    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Adicionar ao body
        document.body.appendChild(notification);

        // Mostrar notificação
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Remover após 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Inicializar o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', function () {
    window.orderSystem = new OrderSystem();
});
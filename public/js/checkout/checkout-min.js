// CAIXA DE SELEÇÃO | PIX/CARTÃO DE CRÉDITO
const paymentMethod = document.getElementById('custom-select-selected'); // Caixa de seleção
const paymentMethodImage = document.getElementById('payment-method-image');
const paymentOptions = document.getElementsByClassName('custom-select-options')[0];
const pixOption = document.getElementsByClassName('custom-select-option-pix')[0];
const creditCardOption = document.getElementsByClassName('custom-select-option-credit-card')[0];

const creditCardForm = document.getElementById('form-checkout');
const creditCard = document.getElementById('credit-card');

let userData;


// Utils

function updatePaymentMethod(text, imageSrc) {
  const spanElement = paymentMethod.querySelector('span');
  spanElement.textContent = text;
  paymentMethodImage.src = imageSrc;
}

function showElement(element) {
  if (element.classList.contains('hidden')) { // Mostrar elemento
    element.classList.remove('hidden');
  }
}

function hiddenElement(element) {
  if (!element.classList.contains('hidden')) { // Esconder elemento
    element.classList.add('hidden');
  }
}

function setLoading(boolean) {
  const popup_await = document.getElementById("popup-await")

  if (boolean) {
    popup_await.classList.remove("hidden")
  } else {
    popup_await.classList.add("hidden")
  }
}

function updateCountdown() {
  const countdownElement = document.getElementById('countdown');
  let timeLeft = 10 * 60;

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function updateText() {
    countdownElement.textContent = formatTime(timeLeft);
  }

  updateText();

  const intervalId = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(intervalId);
      countdownElement.textContent = 'Tempo esgotado!';
    } else {
      timeLeft--;
      updateText();
    }
  }, 1000);
}

async function checkDataUser() {
  const firstName = document.getElementById("first-name")
  const lastName = document.getElementById("last-name")
  const email = document.getElementById("email")
  const cpf = document.getElementById("cpf")
  const phone = document.getElementById("phone")
  const password = document.getElementById("password")

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cpfPattern = /^.{1,16}$/;
  const phonePattern = /^.{1,16}$/;
  const passwordPattern = /\S/;

  function validationInput(pattern, input, error) {
    if (!pattern.test(input.value)) {
      alertMessage("error", error);
      return false;
    }

    return true;
  }

  if (firstName.value.length == 0) {
    return alertMessage("error", "Insira o seu nome")
  }

  if (lastName.value.length == 0) {
    return alertMessage("error", "Insira o seu sobrenome")
  }

  if (!validationInput(emailPattern, email, "Email inválido")) return;
  if (!validationInput(cpfPattern, cpf, "CPF inválido")) return;
  if (!validationInput(phonePattern, phone, "Telefone inválido")) return;
  if (!validationInput(passwordPattern, password, "Senha inválida")) return

  const scriptTag = document.querySelector("script[src='/js/checkout/checkout-min.js']");
  const nameCheckout = scriptTag.getAttribute("name-checkout");
  
  let data = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    cpf: cpf.value,
    phone: phone.value,
    password: password.value,
    nameCheckout: nameCheckout,
    typePlan: window.location.pathname.split('/').pop()
  };

  setLoading(true)

  const validationData = await fetch("/checkout/validate-data/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.value, cpf: cpf.value, phone: phone.value })
  });

  const validationObject = await validationData.json();

  setLoading(false)
  
  if (!validationObject.valid) {
    alertMessage("error", validationObject.error)
  } else {
    userData = data
    showStepTwo()
  }
}



// ETAPAS

function showStepTwo() {
  document.getElementById("step-one").classList.add("hidden")
  document.getElementById("step-two").classList.remove("hidden")
  
  const stepTwoNumber = document.getElementById("step-two-line-number")
  stepTwoNumber.classList.remove("text-gray-500")
  stepTwoNumber.classList.add("bg-purple", "text-white")
  
  const stepTwoText = document.getElementById("step-two-line-text")
  stepTwoText.classList.remove("text-gray-500")
  stepTwoText.classList.add("text-purple")
}

function showSuccessPayment() {
  const checkoutArea = document.getElementById("checkout-area")
  checkoutArea.innerHTML = ""

  const paymentHtml = `
    <div class="flex h-full flex-col justify-center py-40 px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full title">
        <div class="flex items-center justify-center mb-3">
          <img class="h-60" src="/img/main/payment.svg" alt="Sucesso no pagamento">
        </div>

        <h2 style="color: #752a7a" class="flex flex-col text-center text-2xl font-bold leading-9 text-gray-900 inter">Compra realizada com sucesso!</h2>
        <p class="mt-2 text-center text-1xl text-gray-900 inter">Você receberá um email com todos os detalhes da sua compra em breve!</p>

        <div class="flex justify-center">
          <a class="px-6 py-2.5 bg-purple text-white made-tommy mt-8 rounded-md" href="/auth">Realize o seu Login</a>
        </div>
      </div>
    </div>
  `

  const stepThreeNumber = document.getElementById("step-three-line-number")
  stepThreeNumber.classList.remove("text-gray-500")
  stepThreeNumber.classList.add("bg-purple", "text-white")
  
  const stepThreeText = document.getElementById("step-three-line-text")
  stepThreeText.classList.remove("text-gray-500")
  stepThreeText.classList.add("text-purple")

  checkoutArea.insertAdjacentHTML("beforeend", paymentHtml)
}



// PAGAMENTO | PIX

async function checkStatusPix(idCheckoutPix) {
  const response = await fetch("/checkout/check-status-pix", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_checkout_pix: idCheckoutPix })
  });

  const { approved } = await response.json();

  if (approved) {
    showSuccessPayment()
  }
}

async function createPaymentWithPix(data) {
  const typePaymentText = document.getElementById("type-payment").textContent;

  if (typePaymentText !== "PIX") {
    return
  }

  const selectPaymentMethod = document.getElementById("payment-method-container")

  hiddenElement(selectPaymentMethod)

  setLoading(true);

  const responsePayment = await fetch(`/checkout/create-payment/pix/${userData.nameCheckout}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: userData })
  });

  if (!responsePayment.ok) {
    setLoading(false);

    alertMessage('error', 'Não foi possível gerar o código Pix');
    return
  }

  const { qr_code_base64, id_checkout_pix } = await responsePayment.json();

  const qrcodeDiv = document.getElementById("qrcodeDiv");
  const qrcodeImage = document.getElementById("qrcodeImage");

  qrcodeImage.src = "data:image/png;base64," + qr_code_base64;

  setLoading(false)

  alertMessage('success', 'Código PIX gerado, realize o pagamento');

  document.getElementById('payment-pix-area').classList.remove("hidden");

  updateCountdown()

  setInterval(function () {
    checkStatusPix(id_checkout_pix);
  }, 20000);
}



// PAGAMENTO | CARTÃO DE CRÉDITO

function hiddenCreditCard() {
  showElement(document.getElementById('container-cpf-step-01')); // Esconder campo de cpf das informações pessoais
  showElement(document.getElementById('container-email-step-01')); // Esconder campo de email das informações pessoais

  hiddenElement(creditCard); // Esconder cartão de crédito
  hiddenElement(creditCardForm); // Esconder campos do cartão de crédito
}


function showCreditCard() {
  hiddenElement(document.getElementById('container-cpf-step-01')); // Mostrar campo de cpf das informações pessoais
  hiddenElement(document.getElementById('container-email-step-01')); // Mostrar campo de email das informações pessoais

  const selectPaymentMethod = document.getElementById("payment-method-container")

  hiddenElement(selectPaymentMethod)
  
  showElement(creditCardForm); // Mostrar campos do cartão de crédit
}

pixOption.addEventListener('click', function () {
  paymentOptions.classList.add('hidden'); // Esconder opções de pagamento
  updatePaymentMethod("PIX", 'https://img.icons8.com/ios-glyphs/25/ffffff/pix.png'); // Alterar forma de pagamento
  hiddenCreditCard(); // Esconder Cartão de Crédito
  createPaymentWithPix()
})

creditCardOption.addEventListener('click', function () {
  paymentOptions.classList.add('hidden'); // Esconder opções de pagamento
  updatePaymentMethod('Cartão de Crédito', 'https://img.icons8.com/ios-filled/50/ffffff/card-in-use.png'); // Alterar forma de pagamento
  showCreditCard();
})


// DATA DE VALIDADE DO CARTÃO DE CRÉDITO | INPUT
const creditCardExpirationDateParagraph = document.getElementById('card-expiration-date-paragraph');

// CÓDIGO DE VERIFICAÇÃO DE CARTÃO (CVC) | INPUT
const creditCardCvcParagraph = document.getElementById('card-cvc-paragraph');

// NOME DO TITULAR DO CARTÃO DE CRÉDITO | INPUT
const creditCardHolderNameElement = document.getElementById('form-checkout__cardholderName');
const creditCardHolderNameParagraph = document.getElementById('card-name-paragraph');
creditCardHolderNameElement.addEventListener('input', function () {
  creditCardHolderNameParagraph.textContent = creditCardHolderNameElement.value;
})

const mp = new MercadoPago("APP_USR-0746d526-9a34-4d80-9015-3ffbe7d0b0cf");
let payment_type_id;

const cardForm = mp.cardForm({
  amount: "100",
  iframe: true,
  form: {
    id: "form-checkout",
    cardNumber: {
      id: "form-checkout__cardNumber",
      placeholder: "Número do cartão",
    },
    expirationDate: {
      id: "form-checkout__expirationDate",
      placeholder: "MM/YY",
    },
    securityCode: {
      id: "form-checkout__securityCode",
      placeholder: "Código de segurança",
    },
    cardholderName: {
      id: "form-checkout__cardholderName",
      placeholder: "Titular do cartão",
    },
    issuer: {
      id: "form-checkout__issuer",
      placeholder: "Banco emissor",
    },
    installments: {
      id: "form-checkout__installments",
      placeholder: "Parcelas",
    },
    identificationType: {
      id: "form-checkout__identificationType",
      placeholder: "Tipo de documento",
    },
    identificationNumber: {
      id: "form-checkout__identificationNumber",
      placeholder: "Número do documento",
    },
    cardholderEmail: {
      id: "form-checkout__cardholderEmail",
      placeholder: "E-mail",
    },
  },
  callbacks: {
    onFormMounted: error => {
      if (error) return console.warn("Form Mounted handling error: ", error);
    },
    onSubmit: async event => {
      event.preventDefault();

      if (!payment_type_id) {
        alertMessage("error", "Não foi possivel indentificar o método de pagamento, digite novamente o número do cartão de crédito");
        return
      }

      if (payment_type_id !== "credit_card") {
        alertMessage("error", "Método de pagamento não suportado. Certifique-se de utilizar um cartão de crédito válido para realizar o pagamento");
        return
      }

      const cardHolderName = document.getElementById('form-checkout__cardholderName');
      if (!cardHolderName.value) {
        alertMessage("error", "Titular do cartão inválido");
        return
      }

      setLoading(true)

      const checkoutData = userData

      const {
        paymentMethodId: payment_method_id,
        issuerId: issuer_id,
        cardholderEmail: email,
        amount,
        token,
        installments,
        identificationNumber,
        identificationType,
      } = cardForm.getCardFormData();

      const paymentData = {
        token,
        issuer_id,
        payment_method_id,
        transaction_amount: Number(amount),
        installments: Number(installments),
        description: "Descrição do produto",
        payer: {
          email,
          identification: {
            type: identificationType,
            number: identificationNumber,
          },
        },
      };

      try {
        const response = await fetch("/checkout/create-payment/credit-card/" + checkoutData.typePlan, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checkoutData: checkoutData,
            paymentData: paymentData
          }),
        });

        const responsePayment = await response.json();

        setLoading(false)

        if (responsePayment.status == "approved") {
          showSuccessPayment()
        } else {
          alertMessage("error", responsePayment.message);
        }
      } catch (error) {
        alertMessage("error", "Não foi possível estabeler a conexão com o servidor.")
        console.error(`Erro ao processar pagamento: ${error}`);
      }
    },
    onFetching: (resource) => {
      const progressBar = document.querySelector(".progress-bar");
      progressBar.removeAttribute("value");

      return () => {
        progressBar.setAttribute("value", "0");
      };
    },
    onCardTokenReceived: (errors, token) => {
      if (errors) {
        const camposInvalidos = errors.filter(objeto => objeto.cause === "invalid_value").map(objeto => objeto.field);

        if (camposInvalidos.includes("cardNumber")) {
          alertMessage("error", "Número do cartão inválido");
          return
        }
        if (camposInvalidos.includes("securityCode")) {
          alertMessage("error", "Código de segurança do cartão inválido");
          return
        }
        if (camposInvalidos.includes("expirationMonth") || camposInvalidos.includes("expirationYear")) {
          alertMessage("error", "Data de válidade do cartão de crédito inválido");
          return
        }

        errors.forEach(erro => {
          if (erro.message === "parameter cardholderName can not be null/empty") {
            alertMessage("error", `Titular do cartão inválido`);
          } else if (erro.message === "securityCode should be of length '4'.") {
            alertMessage("error", `Código de segurança deve ter comprimento '4'.`);
          } else {
            alertMessage("error", erro.message);
          }
        });
      }

      return token;
    },
    onPaymentMethodsReceived: (error, data) => { // FORMAS DE PAGAMENTO RECEBIDOS(Mastercard, Visa...)
      let payment_method_thumbnail = data[0]["thumbnail"];
      const payment_method_name = data[0]["name"];
      const container_credit_card = document.getElementsByClassName('credit-card')[0];
      payment_type_id = data[0]["payment_type_id"];

      if (payment_method_name === "Visa") { // Bandeira Visa
        payment_method_thumbnail = "https://img.icons8.com/fluency/48/visa.png";
        container_credit_card.style.background = "linear-gradient(135deg, #00B3EE, #0088DA)";
        showElement(document.getElementById('credit-card')); // Mostrar cartão de crédito
      }
      if (payment_method_name === "Mastercard") { // Bandeira Mastercard
        payment_method_thumbnail = "https://img.icons8.com/fluency/48/mastercard.png";
        container_credit_card.style.background = "linear-gradient(135deg, #00AAEA, #0083D8)";
        showElement(document.getElementById('credit-card')); // Mostrar cartão de crédito

      }
      if (payment_method_name === "American Express") { // Bandeira American Express	
        payment_method_thumbnail = "https://img.icons8.com/fluency/48/amex.png";
        container_credit_card.style.background = "linear-gradient(135deg, #00AFEC, #0093DF)";
        showElement(document.getElementById('credit-card')); // Mostrar cartão de crédito
      }
      if (payment_method_name === "Elo Debito") { // Bandeira Elo
        payment_method_thumbnail = "../../img/credit card/elo.svg";
        container_credit_card.style.background = "linear-gradient(135deg, #000000, #000000)";
        showElement(document.getElementById('credit-card')); // Mostrar cartão de crédito
      }
      if (payment_method_name === "Hipercard") { // Bandeira Elo 
        payment_method_thumbnail = "../../img/credit card/hipercard.png";
        container_credit_card.style.background = "linear-gradient(135deg, #B3131B, #B3131B)";
        showElement(document.getElementById('credit-card')); // Mostrar cartão de crédito
      }



      // Alterar imagem
      const imageCreditCardElement = document.getElementById('payment-method-img-credit-card');
      const imageCreditCardInputElement = document.getElementById('payment-method-img-input');
      imageCreditCardElement.src = payment_method_thumbnail;
      if (imageCreditCardElement.classList.contains('hidden')) { // Mostrar Imagem
        imageCreditCardElement.classList.remove('hidden');
      }
      imageCreditCardInputElement.src = payment_method_thumbnail;
      if (imageCreditCardInputElement.classList.contains('hidden')) { // Mostrar Imagem
        imageCreditCardInputElement.classList.remove('hidden');
      }

    },
    onValidityChange: (error, field) => {
      console.log("@onValidityChange error:", error, "@onValidityChange field:", field);

      //removeFieldErrorMessages(input, validationErrorMessages);
      //addFieldErrorMessages(input, validationErrorMessages, error);
      //enableOrDisablePayButton(validationErrorMessages, payButton);
    },
    onReady: () => {},
    onBinChange: (bin) => {
      const container_credit_card = document.getElementsByClassName('credit-card')[0];

      // Pegar elemento do numero do cartão de credito
      const creditCardNumberParagraph = document.getElementById('card-number-paragraph');
      if (bin) {

        // Alterar elemento do numero do cartão de credito para: XXXX XXXX **** **** 
        const numeroDoCartao = bin.padEnd(16, "*").replace(/(.{4})/g, '$1 ').trim();
        creditCardNumberParagraph.textContent = numeroDoCartao;
      } else {
        hiddenElement(document.getElementById('credit-card')); // Esconder cartão de crédito

        // Alterar elemento do numero do cartão de credito para: **** **** **** **** 
        creditCardNumberParagraph.textContent = "**** **** **** ****";

        // Esconder imagem
        const imageCreditCardElement = document.getElementById('payment-method-img-credit-card');
        const imageCreditCardInputElement = document.getElementById('payment-method-img-input');
        imageCreditCardElement.src = "";
        if (!imageCreditCardElement.classList.contains('hidden')) { // Mostrar Imagem
          imageCreditCardElement.classList.add('hidden');
        }
        imageCreditCardInputElement.src = "";
        if (!imageCreditCardInputElement.classList.contains('hidden')) { // Mostrar Imagem
          imageCreditCardInputElement.classList.add('hidden');
        }

        // Alterar background do container do cartão de crédito
        container_credit_card.style.background = "linear-gradient(135deg, #752A7A, #4F005A)";

      }
    }
  },
});




// Document Functions

paymentMethod.addEventListener('click', function () {
  paymentOptions.classList.toggle('hidden'); // Mostrar e Esconder Opções de Pagamento
});

VanillaTilt.init(document.querySelectorAll("#credit-card"));

document.addEventListener("DOMContentLoaded", function () {
  VMasker(document.getElementById('cpf')).maskPattern('999.999.999-99');
  VMasker(document.getElementById('phone')).maskPattern('(99) 99999-9999');
})
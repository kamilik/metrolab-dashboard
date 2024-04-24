const URL = "https://user-service.prod.s.metrolab.store"
const OURL = "https://order-service.prod.s.metrolab.store"

//СОПРОВОЖДЕНИЯ
// Стат
function getSopryStat() {
    fetch(OURL +"/api/statistic/orders", {
        method: "POST",
        headers: {
            'Content-Type': 'application',
            'X-Admin-Token': 'f1c9ce6321806669814df1181a156ca0'
        },
    })

        .then(function (response) {
            return response.json();
        })

        .then(function (sopry) {
            let placeholder = document.querySelector("#sopry-stat");
            let out = "";
            out += `
                <div id="orders-stat">
                <div class="div1 status">
                  <div class="number">${sopry.total_count}</div><br><br>
                  <div class="text">Всего сопровождений</div>
                </div>
                <div class="div2 status">
                  <div class="number">${sopry.in_game_count}</div><br><br>
                  <div class="text">Сопровождений с процессе</div>
                </div>
                <div class="div3 status">
                <div class="number">${sopry.wait_payment}</div><br><br>
                <div class="text">Сопровождения ожидают оплаты</div>
              </div>
                <div class="div4 status">
                <div class="number">${sopry.wait_maintainers}</div><br><br>
                <div class="text">В поиске мейнтейнеров</div>
              </div>
              <div class="div5 status">
                <div class="number">${sopry.complete}</div><br><br>
                <div class="text">Успешно завершенных</div>
              </div>
              <div class="div6 status">
                <div class="number">${sopry.canceled}</div><br><br>
                <div class="text">Отмененных</div>
              </div>
              </div>
`;

            placeholder.innerHTML = out;
        })
}

//МЕЙНТЕЙНЕРЫ
// Стат
function getMaintanersStat() {
    fetch(URL + "/api/statistic/maintainers", {
        method: "POST",
        headers: {
            'X-Admin-Token': 'f1c9ce6321806669814df1181a156ca0'
        },
    })

        .then(function (response) {
            return response.json();
        })

        .then(function (maintaners) {
            let placeholder = document.querySelector("#maintaners-stat");
            let out = "";
            out += `
                <div id="orders-stat">
                <div class="div1 status">
                  <div class="number">${maintaners.stata.total_count}</div><br><br>
                  <div class="text">Всего мейнтейнеров</div>
                </div>
                <div class="div2 status">
                  <div class="number">${maintaners.stata.sum_balance}</div><br><br>
                  <div class="text">Сумма на балансах</div>
                </div>
                <div class="div3 status">
                <div class="number">${maintaners.stata.active_maintainers}</div><br><br>
                <div class="text">Активные майнтейнеры</div>
              </div>
                <div class="div4 status">
                <div class="number">${maintaners.stata.busy_maintainers}</div><br><br>
                <div class="text">Мейнтейнеры на заказах</div>
              </div>
              </div>
`;

            placeholder.innerHTML = out;
        })
}
//Транзакции мейнтейнеров
function getMaintanersTransactionsStat() {
    fetch(URL + "/api/statistic/transactions", {
        method: "POST",
        headers: {
            'Content-Type': 'application',
            'X-Admin-Token': 'f1c9ce6321806669814df1181a156ca0'
        },
    })
        .then(function (response) {
            return response.json();
        })

        .then(function (response) {
            let placeholder = document.querySelector("#tr-maintaners-info");
            let out = `<tr>
            <th >ID</th>
            <th >Telegram ID</th>
            <th >UUID</th>
            <th >Сумма</th>
            <th >Тип</th>
            <th >Платеж</th>
            <th style="width: 78px">Создан</th>
            <th style="width: 78px"">Обновлен</th>
            <th >Кнопка</th>
        </tr>
        `;

            for (let tr of response.transactions) {
                if (tr.type == 'client-top-up') {
                    continue;
                };

                out += `

        <tr>
            <td >${tr.id}</td>
            <td style="width: 70px">${tr.telegram_id}</td>
            <td style="width: 300px">${tr.internal_uuid}</td>`
                switch (tr.type) {
                    case 'maintainer-reward':
                        out += `<td style="width: 30px" class="freeze">-${tr.amount} ₽</td>`;
                        break;
                    case 'maintainer-withdrawal':
                        out += `<td style="width: 30px" class="minus">-${tr.amount} ₽</td>`;
                        break;
                    case 'client-top-up':
                        out += `<td style="width: 30px" class="topup">+${tr.amount} ₽</td>`;
                        break;
                };

                switch (tr.type) {
                    case 'maintainer-reward':
                        out += `<td style="width: 170px">🔒 На счет мейнтейнеру</td>`;
                        break;
                    case 'maintainer-withdrawal':
                        out += `<td style="width: 170px">📤 Вывод мейнтейнеру</td>`;
                        break;
                    case 'client-top-up':
                        out += `<td style="width: 170px">📥 Пополнение клиентом</td>`;
                        break;
                };
                `<td>${tr.type}</td>
            `

                switch (tr.status) {
                    case 'complete':
                        out += `<td>✅ Завершен</td>`;
                        break;
                    case 'pending':
                        out += `<td style="width: 100px">🕒 В процессе</td>`;
                        break;
                };

                out += `<td>`+ ParsTime(tr.created_at); + `</td>`;
                out += `<td>`+ ParsTime(tr.updated_at) + `</td>`;

                if (tr.type == "client-top-up" && tr.status == "pending") {
                    out += `<td  id="button-place"><button onclick="CompleteTransaction('${tr.internal_uuid}')">Принять платеж</button></td>`
                } else {
                    out += `<td id="button-place"></td>`
                }
                out += `<tr>`

            }

            placeholder.innerHTML = out;
        })
}


//КЛИЕНТЫ
// Стат
function getClientsStat() {
    fetch(URL + "/api/statistic/clients", {
        method: "POST",
        headers: {
            'Content-Type': 'application',
            'X-Admin-Token': 'f1c9ce6321806669814df1181a156ca0'
        },
    })

        .then(function (response) {
            return response.json();
        })

        .then(function (clients) {
            
            let placeholder = document.querySelector("#stat");
            let out = "";
            out += `
                <div id="orders-stat">
                <div class="div1 status">
                  <div class="number">${clients.stata.total_count}</div><br><br>
                  <div class="text">Всего клиентов</div>
                </div>
                <div class="div2 status">
                  <div class="number">${clients.stata.total_premium}</div><br><br>
                  <div class="text">Клиентов с Telegram Premium</div>
                </div>
                <div class="div3 status">
                <div class="number">${clients.stata.sum_balance}</div><br><br>
                <div class="text">Сумма на балансах</div>
              </div>
                <div class="div4 status">
                <div class="number">${clients.stata.sum_hold_balance}</div><br><br>
                <div class="text">Баланс на удержании</div>
              </div>
                <div class="div5 status">
                <div class="number">${clients.stata.active_users}</div><br><br>
                <div class="text">Активные клиенты за последний час</div>
              </div>

              </div>
`;

            placeholder.innerHTML = out;
        })
}

//Транзакции клиентов
function getClientsTransactionsStat() {
    fetch(URL + "/api/statistic/transactions", {
        method: "POST",
        headers: {
            'Content-Type': 'application',
            'X-Admin-Token': 'f1c9ce6321806669814df1181a156ca0'
        },
    })
        .then(function (response) {
            return response.json();
        })

        .then(function (response) {
            let placeholder = document.querySelector("#tr-clients-info");
            let out = `<tr>
            <th >ID</th>
            <th >Telegram ID</th>
            <th >UUID</th>
            <th >Сумма</th>
            <th >Тип</th>
            <th >Платеж</th>
            <th style="width: 78px">Создан</th>
            <th style="width: 78px"">Обновлен</th>
            <th >Кнопка</th>
        </tr>
        `;

            for (let tr of response.transactions) {
                if (tr.type !== 'client-top-up') {
                    continue;
                };

                out += `

        <tr>
            <td >${tr.id}</td>
            <td style="width: 70px">${tr.telegram_id}</td>
            <td style="width: 300px">${tr.internal_uuid}</td>`
                switch (tr.type) {
                    case 'maintainer-reward':
                        out += `<td style="width: 30px" class="freeze">-${tr.amount} ₽</td>`;
                        break;
                    case 'maintainer-withdrawal':
                        out += `<td style="width: 30px" class="minus">-${tr.amount} ₽</td>`;
                        break;
                    case 'client-top-up':
                        out += `<td style="width: 30px" class="topup">+${tr.amount} ₽</td>`;
                        break;
                };

                switch (tr.type) {
                    case 'maintainer-reward':
                        out += `<td style="width: 170px">🔒 На счет мейнтейнеру</td>`;
                        break;
                    case 'maintainer-withdrawal':
                        out += `<td style="width: 170px">📤 Вывод мейнтейнеру</td>`;
                        break;
                    case 'client-top-up':
                        out += `<td style="width: 170px">📥 Пополнение клиентом</td>`;
                        break;
                };
                `<td>${tr.type}</td>
            `

                switch (tr.status) {
                    case 'complete':
                        out += `<td>✅ Завершен</td>`;
                        break;
                    case 'pending':
                        out += `<td style="width: 100px">🕒 В процессе</td>`;
                        break;
                };

                out += `<td>`+ ParsTime(tr.created_at); + `</td>`;
                out += `<td>`+ ParsTime(tr.updated_at) + `</td>`;

                if (tr.type == "client-top-up" && tr.status == "pending") {
                    out += `<td  id="button-place"><button onclick="CompleteTransaction('${tr.internal_uuid}')">Принять платеж</button></td>`
                } else {
                    out += `<td id="button-place"></td>`
                }
                out += `<tr>`

            }

            placeholder.innerHTML = out;
        })
}

//ТРАНЗАКЦИИ
//Транзакции все
function getAllTransactionsStat() {
    fetch(URL + "/api/statistic/transactions", {
        method: "POST",
        headers: {
            'Content-Type': 'application',
            'X-Admin-Token': 'f1c9ce6321806669814df1181a156ca0'
        },
    })
        .then(function (response) {
            return response.json();
        })

        .then(function (response) {
            let placeholder = document.querySelector("#transactions-info");
            let out = `<tr>
            <th >ID</th>
            <th >Telegram ID</th>
            <th >UUID</th>
            <th >Сумма</th>
            <th >Тип</th>
            <th >Платеж</th>
            <th style="width: 78px">Создан</th>
            <th style="width: 78px"">Обновлен</th>
            <th >Кнопка</th>
        </tr>
        `;

            for (let tr of response.transactions) {
                 // if (tr.type !== 'client-top-up') {
                 //     continue;
                 // };

                out += `

        <tr>
            <td >${tr.id}</td>
            <td style="width: 70px">${tr.telegram_id}</td>
            <td style="width: 300px">${tr.internal_uuid}</td>`
                switch (tr.type) {
                    case 'maintainer-reward':
                        out += `<td style="width: 30px" class="freeze">-${tr.amount} ₽</td>`;
                        break;
                    case 'maintainer-withdrawal':
                        out += `<td style="width: 30px" class="minus">-${tr.amount} ₽</td>`;
                        break;
                    case 'client-top-up':
                        out += `<td style="width: 30px" class="topup">+${tr.amount} ₽</td>`;
                        break;
                };

                switch (tr.type) {
                    case 'maintainer-reward':
                        out += `<td style="width: 170px">🔒 На счет мейнтейнеру</td>`;
                        break;
                    case 'maintainer-withdrawal':
                        out += `<td style="width: 170px">📤 Вывод мейнтейнеру</td>`;
                        break;
                    case 'client-top-up':
                        out += `<td style="width: 170px">📥 Пополнение клиентом</td>`;
                        break;
                };
                `<td>${tr.type}</td>
            `

                switch (tr.status) {
                    case 'complete':
                        out += `<td>✅ Завершен</td>`;
                        break;
                    case 'pending':
                        out += `<td style="width: 100px">🕒 В процессе</td>`;
                        break;
                };

                out += `<td>`+ ParsTime(tr.created_at); + `</td>`;
                out += `<td>`+ ParsTime(tr.updated_at) + `</td>`;

                if (tr.type == "client-top-up" && tr.status == "pending") {
                    out += `<td  id="button-place"><button onclick="CompleteTransaction('${tr.internal_uuid}')">Принять платеж</button></td>`
                } else {
                    out += `<td id="button-place"></td>`
                }
                out += `<tr>`

            }

            placeholder.innerHTML = out;
        })
}

//ДРУГОЕ:

// !!КНОПКА ПОДТВЕРЖДЕНИЯ ТРАНЗАКЦИИ
function CompleteTransaction(uuid = "") {
    fetch(URL + "/api/transaction/complete", {
        method: "POST",
        headers: {
            'Content-Type': 'application',
            'X-Admin-Token': 'f1c9ce6321806669814df1181a156ca0'
        },
        body: JSON.stringify({
            "uuid": uuid
        }),
    })
        .then(function (response) {
            return response.json();
        })
}

// Перевод в удобное время
function ParsTime(strTime){
    const time = new Date(strTime);
    const monthNames = ["Янв", "02", "Мар", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
    h = time.getHours();
    min = time.getMinutes();
    d = time.getDate();
    m = monthNames[time.getMonth()];
    let outTime = (`<b>`+ h + ":" + min + `</b>` + " " +  d + "." + m );
    return outTime;
}

//работа функций
if (window.location.href.indexOf("sopry") != -1) {
    window.onload = function () {
        getSopryStat();
    };
}

if (window.location.href.indexOf("maintaners") != -1) {
    window.onload = function () {
        getMaintanersStat();
        getMaintanersTransactionsStat();
        
    };
}

if (window.location.href.indexOf("clients") != -1) {
    window.onload = function () {
        getClientsStat();
        getClientsTransactionsStat()
    };
}

if (window.location.href.indexOf("transactions") != -1) {
    window.onload = function () {
        getAllTransactionsStat();
    };
}

//switch pages

document.getElementById("panel").onclick = function () {
    location.href = "./index.html";
};

document.getElementById("sopry").onclick = function () {
    location.href = "./sopry.html";
};

document.getElementById("maintaners").onclick = function () {
    location.href = "./maintaners.html";
};

document.getElementById("clients").onclick = function () {
    location.href = "./clients.html";
};

document.getElementById("transactions").onclick = function () {
    location.href = "./transactions.html";
};

document.getElementById("settings").onclick = function () {
    location.href = "./settings.html";
};

document.getElementById("exit").onclick = function () {
    location.href = "./exit.html";
};

// generate md5 hash authorization



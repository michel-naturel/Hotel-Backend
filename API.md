# Hotel Reservation API

Base URL

http://localhost:3000

Wszystkie daty muszą być w formacie:

YYYY-MM-DD

Przykład:
2026-07-01


================================
ROOMS
================================

GET /rooms

Opis:
Zwraca listę wszystkich pokoi.

Response

[
  {
    "id": 1,
    "number": "101",
    "type": "single",
    "price": 200
  },
  {
    "id": 2,
    "number": "102",
    "type": "double",
    "price": 300
  }
]


--------------------------------

POST /rooms

Opis:
Dodaje nowy pokój.

Request

{
  "number": "103",
  "type": "single",
  "price": 250
}

Response

{
  "id": 3
}


--------------------------------

GET /rooms/available

Opis:
Zwraca pokoje dostępne w podanym terminie.

Query parameters

checkIn
checkOut

Przykład

GET /rooms/available?checkIn=2026-07-01&checkOut=2026-07-05

Response

[
  {
    "id": 1,
    "number": "101",
    "type": "single",
    "price": 200
  }
]


--------------------------------

GET /rooms/:id/reservations

Opis:
Zwraca rezerwacje dla konkretnego pokoju.

Przykład

GET /rooms/1/reservations

Response

[
  {
    "id": 1,
    "guestName": "Jan",
    "roomId": 1,
    "checkIn": "2026-07-01",
    "checkOut": "2026-07-05"
  }
]


================================
RESERVATIONS
================================

GET /reservations

Opis:
Zwraca listę wszystkich rezerwacji.

Response

[
  {
    "id": 1,
    "guestName": "Jan",
    "roomId": 1,
    "checkIn": "2026-07-01",
    "checkOut": "2026-07-05"
  }
]


--------------------------------

POST /reservations

Opis:
Tworzy nową rezerwację.

Request

{
  "guestName": "Jan",
  "roomId": 1,
  "checkIn": "2026-07-01",
  "checkOut": "2026-07-05"
}

Response

{
  "id": 5
}


--------------------------------

DELETE /reservations/:id

Opis:
Usuwa rezerwację.

Przykład

DELETE /reservations/5

Response

{
  "message": "Reservation deleted"
}


================================
VALIDATION RULES
================================

checkOut musi być później niż checkIn

checkOut > checkIn

Daty muszą być w formacie:

YYYY-MM-DD

Przykład:

2026-07-01


================================
FRONTEND EXAMPLES
================================

Pobranie pokoi

fetch("http://localhost:3000/rooms")


--------------------------------

Sprawdzenie dostępności

fetch(
  "http://localhost:3000/rooms/available?checkIn=2026-07-01&checkOut=2026-07-05"
)


--------------------------------

Tworzenie rezerwacji

fetch("http://localhost:3000/reservations", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    guestName: "Jan",
    roomId: 1,
    checkIn: "2026-07-01",
    checkOut: "2026-07-05"
  })
})


================================
PROJECT STRUCTURE
================================

hotel-backend
│
├── server.js
├── package.json
│
└── src
    ├── app.js
    │
    ├── routes
    │   ├── rooms.js
    │   └── reservations.js
    │
    ├── controllers
    │   ├── roomsController.js
    │   └── reservationsController.js
    │
    └── models
        ├── rooms.js
        └── reservations.js


================================
REQUIREMENTS
================================

Node.js
npm


================================
INSTALLATION
================================

npm install


================================
RUN SERVER
================================

node server.js


Serwer będzie dostępny pod adresem:

http://localhost:3000

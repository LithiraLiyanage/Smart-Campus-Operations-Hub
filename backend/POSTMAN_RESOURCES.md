## Facilities & Assets Module – Example API Requests (Postman style)

Base URL (adjust to your server port):
- `http://localhost:8083/api`

Auth:
- Add header `Authorization: Bearer <JWT>`
- JWT must include claim `role` with value `ADMIN` or `USER`

---

### 1) Create Resource (ADMIN)
**POST** `/resources`

Headers:
- `Content-Type: application/json`
- `Authorization: Bearer <ADMIN_JWT>`

Body:
```json
{
  "name": "Lecture Room A",
  "type": "ROOM",
  "capacity": 50,
  "location": "Block A - Floor 2",
  "description": "Projector + AC",
  "availableFrom": "08:00",
  "availableTo": "18:00",
  "status": "ACTIVE"
}
```

---

### 2) Get All Resources (USER / ADMIN)
**GET** `/resources`

Headers:
- `Authorization: Bearer <JWT>`

---

### 3) Filter Resources (USER / ADMIN)
**GET** `/resources?type=ROOM&capacity=50&location=Block%20A&status=ACTIVE`

Notes:
- `capacity` means **capacity >= value**
- Any parameter may be omitted (dynamic filtering)

---

### 4) Get Resource By ID (USER / ADMIN)
**GET** `/resources/{id}`

Headers:
- `Authorization: Bearer <JWT>`

---

### 5) Update Resource (ADMIN)
**PUT** `/resources/{id}`

Headers:
- `Content-Type: application/json`
- `Authorization: Bearer <ADMIN_JWT>`

Body:
```json
{
  "name": "Lecture Room A (Renovated)",
  "type": "ROOM",
  "capacity": 60,
  "location": "Block A - Floor 2",
  "description": "New seating layout",
  "availableFrom": "08:00",
  "availableTo": "20:00",
  "status": "ACTIVE"
}
```

---

### 6) Delete Resource (ADMIN)
**DELETE** `/resources/{id}`

Headers:
- `Authorization: Bearer <ADMIN_JWT>`


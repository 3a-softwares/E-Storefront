# Category Service API

## 📡 Endpoints

### List Categories

```http
GET /categories
```

**Response (200):**

```json
{
  "success": true,
  "categories": [{ "id": "...", "name": "Electronics", "slug": "electronics" }]
}
```

### Get Category Tree

```http
GET /categories/tree
```

**Response (200):**

```json
{
  "success": true,
  "tree": [
    {
      "id": "...",
      "name": "Electronics",
      "slug": "electronics",
      "children": [
        {
          "id": "...",
          "name": "Computers",
          "slug": "computers",
          "children": []
        }
      ]
    }
  ]
}
```

### Get Category

```http
GET /categories/:slug
```

### Get Breadcrumb

```http
GET /categories/:id/breadcrumb
```

### Create Category (Admin)

```http
POST /categories
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "New Category",
  "parent": "parent-id",
  "description": "Description"
}
```

### Update Category (Admin)

```http
PUT /categories/:id
Authorization: Bearer <token>
```

### Delete Category (Admin)

```http
DELETE /categories/:id
Authorization: Bearer <token>
```

---

See also:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Service architecture

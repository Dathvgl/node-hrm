# Tên dự án : HRM Management Server
Đây là backend trang web quản lý nhân sự cơ bản. [Frontend](https://github.com/Dathvgl/vite-hrm)

## Trạng Thái Dự Án
Hiện tại, dự án đang trong giai đoạn phát triển và có nhiều thiếu sót mong mọi người có thể góp ý thêm ạ.

## Middleware
- ErrorHandler (bắt lỗi chung)
- TryCatch (bắt lỗi route cho ErrorHandler)
- RoleHandler (phân quyền route)

### Role
```json
{
  "_id": string, như "id"
  "stt": number,
  "name": string,
  "createdAt": number,
  "updatedAt": number,
}
```

### Company
```json
{
  "_id": string, như "id"
  "stt": number,
  "code": string,
  "name": string,
  "address": string,
  "constructionYear": string,
  "operationYear": string,
  "createdAt": number,
  "updatedAt": number,
}
```

### Department
```json
{
  "_id": string, như "id"
  "stt": number,
  "name": string,
  "salary": string | undefined, từ Salary
  "description": string,
  "createdAt": number,
  "updatedAt": number,
}
```

### Position
```json
{
  "_id": string, như "id"
  "stt": number,
  "name": string,
  "department": string, từ Department
  "salary": number,
  "allowance": number | undefined,
  "createdAt": number,
  "updatedAt": number,
}
```

### Personnel
```json
{
  "_id": string,
  "id": string, từ uid Firebase
  "stt": number,
  "name": string,
  "position": string, từ Position
  "department": string, từ Department
  "phone": string,
  "birth": string,
  "address": string,
  "email": string,
  "roles": string[], từ Role lấy name:"staff" | "manager" | "admin" | "boss"
  "company": string, từ Company
  "createdAt": number,
  "updatedAt": number,
}
```

### Vacation
```json
{
  "_id": string, như "id"
  "stt": number,
  "personnel": string, từ Personnel
  "offDays": string[],
  "reason": string,
  "status": "pending" | "accept" | "refuse",
  "createdAt": number,
  "updatedAt": number,
}
```

### Timesheet
```json
{
  "_id": string, như "id"
  "stt": number,
  "personnel": string, từ Personnel
  "year": number,
  "month": number,
  "days": number[],
  "createdAt": number,
  "updatedAt": number,
}
```

### Salary
```json
{
  "_id": string, như "id"
  "stt": number,
  "type": "time" | "revenue" | "contract" | "product" | "bonus",
  "name": string,
  "createdAt": number,
  "updatedAt": number,
}
```

### SalaryRevenue
```json
{
  "_id": string, như "id"
  "stt": number,
  "personnel": string, từ Personnel
  "day": number,
  "month": number,
  "year": number,
  "salaries": {
    "revenue": number,
    "percentage": number,
  }[],
  "createdAt": number,
  "updatedAt": number,
}
```

### SalaryContract
```json
{
  "_id": string, như "id"
  "stt": number,
  "personnel": string, từ Personnel
  "day": number,
  "month": number,
  "year": number,
  "salaries": {
    "base": number,
    "percentage": number,
  }[],
  "createdAt": number,
  "updatedAt": number,
}
```

### SalaryProduct
```json
{
  "_id": string, như "id"
  "stt": number,
  "personnel": string, từ Personnel
  "day": number,
  "month": number,
  "year": number,
  "salaries": {
    "base": number,
    "quantity": number,
  }[],
  "createdAt": number,
  "updatedAt": number,
}
```

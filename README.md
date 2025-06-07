# **🚀 Fullstack Authentication Server 🛡️**

A robust and scalable authentication server built with TypeScript, Drizzle ORM, and Express.js. This project provides a solid foundation for user registration, login, and secure access management.

## ✨ Features

- **🔒 Secure Authentication**: Utilizes JWT for secure user authentication.
- **🛡️ Role-Based Access Control (RBAC)**: Implements RBAC to manage user
  permissions.
- **⚙️ Configuration**: Uses .env files for easy configuration.
- **🗄️ Database Migrations**: Uses Drizzle for database schema management and
  migrations.
- **✅ Validation**: Employs Zod for robust data validation.

## 🛠️ Installation

Follow these steps to get the project running locally:

1.  **Clone the Repository**:

    ```bash
    git clone https://github.com/amnesia2k/fullstack.git
    cd server
    ```

2.  **Install Dependencies**:

    ```bash
    pnpm install
    ```

3.  **Set Up Environment Variables**:

    - Create a .env file based on .env.example.
    - Update the environment variables with your actual values.

    ```
    PORT=8000
    DATABASE_URL="your_database_url_here"
    JWT_SECRET=your_jwt_secret_key
    ```

4.  **Database Setup**:

    - Run the database migrations:

    ```bash
    pnpm db:push
    ```

5.  **Start the Server**:

    ```bash
    pnpm dev
    ```

## 💻 Usage

### Endpoints

<details>
<summary>
    Register a new user.
</summary>

- **`POST /api/v1/register`**:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword"
}
```

</details>

<details>
<summary>
    Login an existing user.
</summary>

- **`POST /api/v1/login`**:

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword"
}
```

</details>

- **`POST /api/v1/logout`**: Logout the current user.

- **`GET /api/v1/users`**: Get all users (Admin only).

- **`GET /api/v1/user`**: Get the current user's information.

<details>
<summary>
    Update the current user's information.
</summary>

- **`PATCH /api/v1/user`**:

```json
{
  "name": "Updated Name",
  "bio": "Updated bio information"
}
```

</details>

- **`DELETE /api/v1/delete`**: Delete the current user's account.

<details>
<summary>
    Delete a user by ID (Admin only).
</summary>

- **`DELETE /api/v1/admin/delete`**:

```json
{
  "_id": "user_id_to_delete"
}
```

</details>

### Middleware

- **validateData**: Validates request body against a Zod schema.
- **validateToken**: Validates JWT token and attaches user info to the
  request.
- **validateUserRole**: Validates user role against allowed roles.

## ✨ Key Features

- ✔️ **User Authentication**: Securely manage user registration and login.
- 🛡️ **Role-Based Access Control**: Control access based on user roles (user,
  creator, admin).
- 🔑 **JWT Authentication**: Use JSON Web Tokens for authentication.
- 🗄️ **Database Migrations**: Easily manage database schema changes with
  Drizzle.
- 🔒 **Password Hashing**: Securely hash and compare passwords using
  bcryptjs.
- 🍪 **Cookie Management**: Utilizes cookies for token storage.
- 🌐 **CORS**: Configured for Cross-Origin Resource Sharing.

## 🛠️ Technologies Used

| Technology     | Link                                                                                       |
| :------------- | :----------------------------------------------------------------------------------------- |
| TypeScript     | [https://www.typescriptlang.org/](https://www.typescriptlang.org/)                         |
| Express.js     | [https://expressjs.com/](https://expressjs.com/)                                           |
| Drizzle ORM    | [https://orm.drizzle.team/](https://orm.drizzle.team/)                                     |
| Zod            | [https://zod.dev/](https://zod.dev/)                                                       |
| JSON Web Token | [https://jwt.io/](https://jwt.io/)                                                         |
| bcryptjs       | [https://www.npmjs.com/package/bcryptjs](https://www.npmjs.com/package/bcryptjs)           |
| pnpm           | [https://pnpm.io/](https://pnpm.io/)                                                       |
| Cors           | [https://www.npmjs.com/package/cors](https://www.npmjs.com/package/cors)                   |
| Cookie Parser  | [https://www.npmjs.com/package/cookie-parser](https://www.npmjs.com/package/cookie-parser) |

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

- Report bugs 🐛
- Suggest enhancements ✨
- Submit pull requests 🛠️

### Contribution Guidelines

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Commit your changes with clear and concise messages.
4.  Push your branch to your forked repository.
5.  Submit a pull request.

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## 👨‍💻 Author Info

- **Author**: [Your Name]
  - [X](https://twitter.com/@olathedev_)
  - [LinkedIn](https://www.linkedin.com/in/olatilewaolatoye)
  - [GitHub](https://github.com/amnesia2k)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)

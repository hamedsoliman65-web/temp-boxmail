import AdminLogin from "../blog/AdminLogin";

export default function AdminLoginExample() {
  return (
    <AdminLogin
      onLogin={async (username, password) => {
        console.log("Login attempt:", { username, password });
        return username === "admin" && password === "password";
      }}
    />
  );
}

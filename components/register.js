"use client"; // This is a client component 👈🏽

import { useForm } from "react-hook-form";
import { useState } from "react";

export default function Register() {
  const { register, handleSubmit, reset } = useForm();
  const [response, setResponse] = useState(null);

  const onSubmit = async (data) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    setResponse(result);
    if (res.ok) reset();
  };

  return (
    <div>
      <h1>User Registration</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name</label>
          <input type="text" {...register("name", { required: true })} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" {...register("email", { required: true })} />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("password", { required: true, minLength: 6 })}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {response && (
        <div
          style={{ marginTop: "1rem", color: response.error ? "red" : "green" }}
        >
          {response.error || response.message}
        </div>
      )}
    </div>
  );
}

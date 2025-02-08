/*"use client";
import React from "react";
import useSWR from "swr";

//const fetcher = (url) => fetch(url).then((res) => res.json());
async function fetchAllItems() {
  const response = await fetch("http://localhost:3000/myusers");
  const data = await response.json();
  return data;
}
export default function Users() {
  //const { data: users, error } = useSWR("./api/users", fetcher);
  const { data: users, error } = useSWR("fetchAllItems", fetchAllItems);

  if (error) return <div>Failed to load</div>;
  if (!users) return <div>Loading...</div>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.name}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}*/
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function GetUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("./api/apiusers");
        setUsers(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  if (error) return <div>{error}</div>;
  if (!users.length) return <div>Loading...</div>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} {user.email}
        </li>
      ))}
    </ul>
  );
}

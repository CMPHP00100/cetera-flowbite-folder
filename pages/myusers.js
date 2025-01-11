import prisma from "../lib/prisma";
import { format } from "date-fns";

export async function getServerSideProps() {
  const users = await prisma.user.findMany();
  const events = await prisma.event.findMany();
  return {
    //props: { users },
    props: {
      startingUsers: JSON.parse(JSON.stringify(users)),
      startingEvents: JSON.parse(JSON.stringify(events)),
    },
  };
}

export default function MyUsers({ startingUsers, startingEvents }) {
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {startingUsers.map((user, index) => (
          <li key={index}>
            {user.name} - {user.id}
          </li>
        ))}
      </ul>
      <h1>Events</h1>
      <ul>
        {startingEvents.map((event, index) => (
          <li key={index}>
            {format(new Date(event.startTime), "MMMM d, yyyy, h:mm a")} -{" "}
            {format(new Date(event.endTime), "MMMM d, yyyy, h:mm a")}
          </li>
        ))}
      </ul>
    </div>
  );
}

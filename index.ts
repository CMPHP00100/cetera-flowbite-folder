//import prisma from "./lib/prisma";
import type { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async () => {
  const prisma = require('./lib/prisma');
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { feed },
    revalidate: 10,
  };
};

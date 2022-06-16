import type { NextApiRequest, NextApiResponse } from "next";
import { getTopRevenues, getUser } from "../../sqlite3/database";

type Data = {
  name?: string;
  error?: string;
  result?: any[];
};

const getUserPayout = async (id: string): Promise<any[]> => await getUser(id);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      const { id } = req.query;
      if (!id) {
        res.status(400).json({ error: "Missing id" });
        return;
      }
      const result = await getUserPayout(id as string);
      res.status(200).json({ result });
  }
}

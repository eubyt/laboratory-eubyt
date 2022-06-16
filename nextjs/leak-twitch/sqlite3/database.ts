import { open } from "sqlite";
import sqlite3 from "sqlite3";

async function openDb() {
  return open({
    filename: "./revenues.db",
    driver: sqlite3.Database,
  });
}

const formatDollar = (num: number) => {
  var p = (num / 100).toFixed(2).split(".");
  return [
    "$",
    p[0]
      .split("")
      .reverse()
      .reduce(function (acc, num, i) {
        return num + (i && !(i % 3) ? "," : "") + acc;
      }, "."),
    p[1],
  ].join("");
};

const twitchAPI = async (twitchId: string): Promise<any[]> => {
  const response = await fetch(
    `https://api.ivr.fi/twitch/resolve/${twitchId}?id=true`
  );
  const data = await response.json();
  return data;
};

const getTopRevenues = async (total: number): Promise<any[]> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    db.all(
      `WITH ranked AS (SELECT dense_rank() OVER (ORDER BY sum_salary_all DESC) AS position, id, sum_salary_all FROM all_years) SELECT * FROM ranked WHERE position <= ${total} ORDER BY position`
    )
      .then(
        (
          rows: {
            position: Number;
            id: Number;
            sum_salary_all: any;
          }[]
        ) => {
          const result = rows.map(async (row) => {
            const data = await twitchAPI(String(row.id));

            return {
              rank: row.position,
              streamerId: row.id,
              sum_salary_all: formatDollar(row.sum_salary_all),
              twitch_data: data,
            };
          });
          Promise.all(result).then((data) => {
            resolve(data);
          });
        }
      )
      .catch((err) => {
        reject(err);
      });
  });
};

const getUser = async (twitchId: string): Promise<any[]> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    db.all(
      `WITH ranked AS (SELECT dense_rank() OVER (ORDER BY sum_salary_all DESC) AS position, id, sum_salary_all FROM all_years) SELECT * FROM ranked WHERE id==? ORDER BY position`,
      [twitchId]
    )
      .then(
        (
          rows: {
            position: Number;
            id: Number;
            sum_salary_all: any;
          }[]
        ) => {
          const result = rows.map(async (row) => {
            const data = await twitchAPI(String(row.id));

            return {
              rank: row.position,
              streamerId: row.id,
              sum_salary_all: formatDollar(row.sum_salary_all),
              twitch_data: data,
            };
          });
          Promise.all(result).then((data) => {
            resolve(data);
          });
        }
      )
      .catch((err) => {
        reject(err);
      });
  });
};

export { getTopRevenues, getUser };

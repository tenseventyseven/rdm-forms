import { FormData } from "@/components/RequestForm";

const DAG_ID = "data_ingest";
const AIRFLOW_URL = `${process.env.AIRFLOW_HOST}/api/v1/dags/${DAG_ID}/dagRuns`;

export async function POST(req: Request): Promise<Response> {
  const formData: FormData = await req.json();
  console.log(formData);

  try {
    const res = await fetch(AIRFLOW_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.AIRFLOW_AUTH,
      },
      body: JSON.stringify({ conf: formData }),
    });

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}

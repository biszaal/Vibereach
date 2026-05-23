import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";
import { db, PROJECTS_TABLE } from "./dynamodb";
import type { Playbook } from "./ai";

export type ProjectStatus = "analyzing" | "ready" | "failed";

export interface Project {
  projectId: string;
  url: string;
  name: string;
  status: ProjectStatus;
  playbook?: Playbook;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

function newId(): string {
  return crypto.randomBytes(8).toString("hex");
}

const SK = "PROFILE";

function pk(projectId: string) {
  return `PROJECT#${projectId}`;
}

export async function createProject(
  url: string,
  name: string,
  userId = "anonymous"
): Promise<Project> {
  const projectId = newId();
  const now = new Date().toISOString();
  const item: Project = {
    projectId,
    url,
    name,
    status: "analyzing",
    createdAt: now,
    updatedAt: now,
    userId,
  };

  await db.send(
    new PutCommand({
      TableName: PROJECTS_TABLE,
      Item: { pk: pk(projectId), sk: SK, ...item },
    })
  );

  return item;
}

export async function getProject(projectId: string): Promise<Project | null> {
  const res = await db.send(
    new GetCommand({
      TableName: PROJECTS_TABLE,
      Key: { pk: pk(projectId), sk: SK },
    })
  );
  if (!res.Item) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { pk: _pk, sk: _sk, ...rest } = res.Item;
  return rest as Project;
}

export async function updateProjectPlaybook(
  projectId: string,
  playbook: Playbook,
  name: string
): Promise<void> {
  await db.send(
    new UpdateCommand({
      TableName: PROJECTS_TABLE,
      Key: { pk: pk(projectId), sk: SK },
      UpdateExpression:
        "SET #status = :status, playbook = :playbook, #name = :name, updatedAt = :now",
      ExpressionAttributeNames: { "#status": "status", "#name": "name" },
      ExpressionAttributeValues: {
        ":status": "ready",
        ":playbook": playbook,
        ":name": name,
        ":now": new Date().toISOString(),
      },
    })
  );
}

export async function updateProjectFailed(
  projectId: string,
  errorMessage: string
): Promise<void> {
  await db.send(
    new UpdateCommand({
      TableName: PROJECTS_TABLE,
      Key: { pk: pk(projectId), sk: SK },
      UpdateExpression: "SET #status = :status, errorMessage = :err, updatedAt = :now",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: {
        ":status": "failed",
        ":err": errorMessage,
        ":now": new Date().toISOString(),
      },
    })
  );
}

export async function listUserProjects(userId: string): Promise<Project[]> {
  const res = await db.send(
    new QueryCommand({
      TableName: PROJECTS_TABLE,
      IndexName: "userId-index",
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: { ":uid": userId },
    })
  );
  return (res.Items ?? []).map(({ pk: _pk, sk: _sk, ...rest }) => rest as Project);
}

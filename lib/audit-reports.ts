import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";
import { db } from "./dynamodb";
import type { AuditReport } from "./claude";

export const AUDIT_TABLE = process.env.AUDIT_TABLE_NAME ?? "vibereach-audit-reports";

export interface AuditReportRecord {
  reportId: string;
  projectId: string;
  url: string;
  score: number;
  report: AuditReport;
  createdAt: string;
}

const pk = (reportId: string) => `REPORT#${reportId}`;
const SK = "PROFILE";

export async function saveAuditReport(
  projectId: string,
  url: string,
  report: AuditReport
): Promise<AuditReportRecord> {
  const reportId = crypto.randomBytes(8).toString("hex");
  const record: AuditReportRecord = {
    reportId,
    projectId,
    url,
    score: report.score,
    report,
    createdAt: new Date().toISOString(),
  };

  await db.send(
    new PutCommand({
      TableName: AUDIT_TABLE,
      Item: { pk: pk(reportId), sk: SK, ...record },
    })
  );

  return record;
}

export async function getLatestAuditReport(
  projectId: string
): Promise<AuditReportRecord | null> {
  const res = await db.send(
    new QueryCommand({
      TableName: AUDIT_TABLE,
      IndexName: "projectId-index",
      KeyConditionExpression: "projectId = :pid",
      ExpressionAttributeValues: { ":pid": projectId },
      ScanIndexForward: false,
      Limit: 1,
    })
  );
  if (!res.Items?.length) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { pk: _pk, sk: _sk, ...rest } = res.Items[0];
  return rest as AuditReportRecord;
}

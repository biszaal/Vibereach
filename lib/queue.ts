import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

let sqsClient: SQSClient | null = null;

function getSqs(): SQSClient | null {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.SQS_QUEUE_URL) return null;
  if (!sqsClient) {
    sqsClient = new SQSClient({
      region: process.env.AWS_REGION ?? "eu-west-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }
  return sqsClient;
}

export interface QueuePostPayload {
  postId: string;
  projectId: string;
  subreddit: string;
  scheduledAt: string;
}

export async function enqueuePost(payload: QueuePostPayload): Promise<void> {
  const sqs = getSqs();
  if (!sqs) {
    // SQS not configured — log and continue (post stays as scheduled in DB)
    console.log("[queue] SQS not configured, skipping enqueue for", payload.postId);
    return;
  }

  // Delay message delivery until scheduledAt (max SQS delay: 15 min)
  const delaySeconds = Math.min(
    900,
    Math.max(0, Math.floor((new Date(payload.scheduledAt).getTime() - Date.now()) / 1000))
  );

  await sqs.send(
    new SendMessageCommand({
      QueueUrl: process.env.SQS_QUEUE_URL!,
      MessageBody: JSON.stringify(payload),
      DelaySeconds: delaySeconds,
      MessageGroupId: payload.subreddit, // FIFO queue — one post per sub at a time
      MessageDeduplicationId: payload.postId,
    })
  );
}

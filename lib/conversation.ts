import { db } from "./db";

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation = await findConversation(memberOneId, memberTwoId);
  if (!conversation) {
    conversation = await createConversation(memberOneId, memberTwoId);
  }
  return conversation;
};

const createConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    /* The code `return await db.conversation.findFirst({ ... })` is querying the database to find a
    conversation between two members. */
    return await db.conversation.findFirst({
      where: {
        OR: [
          { memberOneId, memberTwoId },
          { memberOneId: memberTwoId, memberTwoId: memberOneId },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
};

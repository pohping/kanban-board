import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import {
  PrismaClient,
  type BoardRole,
  type Board,
} from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/* -------------------------------------------------------------------------- */
/*                                 Config                                     */
/* -------------------------------------------------------------------------- */

const NUM_USERS = 8;
const NUM_BOARDS = 3;
const COLUMN_TITLES = ['Backlog', 'To Do', 'In Progress', 'In Review', 'Done'];

const LABEL_POOL = [
  { name: 'Bug', color: '#ef4444' },
  { name: 'Feature', color: '#3b82f6' },
  { name: 'Design', color: '#a855f7' },
  { name: 'Urgent', color: '#f97316' },
  { name: 'Backend', color: '#10b981' },
  { name: 'Frontend', color: '#06b6d4' },
  { name: 'Docs', color: '#64748b' },
  { name: 'Tech Debt', color: '#eab308' },
];

const SEED_PASSWORD = 'password123';

/* -------------------------------------------------------------------------- */
/*                                 Helpers                                    */
/* -------------------------------------------------------------------------- */

function randomItem<T>(arr: T[]): T {
  return faker.helpers.arrayElement(arr);
}

/**
 * Pick a random, DEDUPED subset of `arr`. min/max are clamped to arr.length
 * so this never throws when arr is smaller than the requested range —
 * the previous version could pass min > arr.length and crash.
 */
function randomSubset<T>(arr: T[], min: number, max: number): T[] {
  if (arr.length === 0) return [];
  const safeMax = Math.min(max, arr.length);
  const safeMin = Math.min(min, safeMax);
  const count = faker.number.int({ min: safeMin, max: safeMax });
  return faker.helpers.arrayElements(arr, count); // arrayElements never repeats an item
}

function maybeDueDate(): Date | null {
  // ~55% chance of a due date, ranging from a few days overdue to 30 days out
  if (faker.datatype.boolean(0.45)) return null;
  return faker.date.soon({ days: 30, refDate: faker.date.recent({ days: 5 }) });
}

function uniqueUsername(taken: Set<string>): string {
  let username = faker.internet.username().toLowerCase();
  let guard = 0;
  while (taken.has(username) && guard < 50) {
    username = faker.internet.username().toLowerCase();
    guard++;
  }
  taken.add(username);
  return username;
}

/* -------------------------------------------------------------------------- */
/*                                    Seed                                    */
/* -------------------------------------------------------------------------- */

async function main() {
  faker.seed(42); // deterministic output; remove for fresh random data each run

  console.log('Clearing existing data...');
  await prisma.attachment.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.cardLabel.deleteMany();
  await prisma.cardAssignee.deleteMany();
  await prisma.card.deleteMany();
  await prisma.column.deleteMany();
  await prisma.label.deleteMany();
  await prisma.boardMember.deleteMany();
  await prisma.board.deleteMany();
  await prisma.user.deleteMany();

  console.log(`Creating ${NUM_USERS} users...`);
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
  const usedUsernames = new Set<string>();

  const users = await Promise.all(
    Array.from({ length: NUM_USERS }).map(() => {
      const username = uniqueUsername(usedUsernames);
      return prisma.user.create({
        data: {
          username,
          email: faker.internet.email({ firstName: username }).toLowerCase(),
          passwordHash,
        },
      });
    }),
  );

  console.log(`Creating ${NUM_BOARDS} boards...`);
  const boards: Board[] = [];

  for (let i = 0; i < NUM_BOARDS; i++) {
    const owner = randomItem(users);
    const otherMembers = randomSubset(
      users.filter((u) => u.id !== owner.id),
      2,
      5,
    );

    const memberRows: { userId: string; role: BoardRole }[] = [
      { userId: owner.id, role: 'owner' },
      ...otherMembers.map((m, idx): { userId: string; role: BoardRole } => ({
        userId: m.id,
        role: idx === 0 ? 'admin' : 'member',
      })),
    ];

    const board = await prisma.board.create({
      data: {
        title: faker.company.catchPhrase(),
        description: faker.datatype.boolean(0.85)
          ? faker.lorem.sentence({ min: 8, max: 16 })
          : null,
        ownerId: owner.id,
        members: { create: memberRows },
      },
    });
    boards.push(board);
  }

  console.log('Creating labels, columns, and cards for each board...');
  let totalCards = 0;

  for (const board of boards) {
    const boardMemberRows = await prisma.boardMember.findMany({
      where: { boardId: board.id },
      select: { userId: true },
    });
    const memberIds = new Set(boardMemberRows.map((m) => m.userId));
    const memberUsers = users.filter((u) => memberIds.has(u.id));

    const labelSet = randomSubset(LABEL_POOL, 4, 6);
    const labels = await Promise.all(
      labelSet.map((l) =>
        prisma.label.create({
          data: { boardId: board.id, name: l.name, color: l.color },
        }),
      ),
    );

    const columns = await Promise.all(
      COLUMN_TITLES.map((title, position) =>
        prisma.column.create({
          data: { boardId: board.id, title, position },
        }),
      ),
    );

    for (const column of columns) {
      const cardsInColumn = faker.number.int({ min: 2, max: 6 });

      for (let position = 0; position < cardsInColumn; position++) {
        const creator = randomItem(memberUsers);

        const card = await prisma.card.create({
          data: {
            columnId: column.id,
            title: faker.hacker.phrase().replace(/^./, (c) => c.toUpperCase()),
            description: faker.datatype.boolean(0.75)
              ? faker.lorem.paragraph({ min: 1, max: 3 })
              : null,
            position,
            dueDate: maybeDueDate(),
            createdBy: creator.id,
          },
        });
        totalCards++;

        // Assignees — deduped subset of this board's members only
        const assignees = randomSubset(memberUsers, 0, 3);
        for (const user of assignees) {
          await prisma.cardAssignee.create({
            data: { cardId: card.id, userId: user.id },
          });
        }

        // Labels — deduped subset, avoids duplicate (cardId, labelId) pairs
        const cardLabels = randomSubset(labels, 0, 3);
        for (const label of cardLabels) {
          await prisma.cardLabel.create({
            data: { cardId: card.id, labelId: label.id },
          });
        }

        // Comments
        const commentCount = faker.number.int({ min: 0, max: 4 });
        for (let c = 0; c < commentCount; c++) {
          await prisma.comment.create({
            data: {
              cardId: card.id,
              userId: randomItem(memberUsers).id,
              content: faker.lorem.sentence({ min: 5, max: 20 }),
            },
          });
        }

        // Attachments
        if (faker.datatype.boolean(0.3)) {
          const attachmentCount = faker.number.int({ min: 1, max: 2 });
          for (let a = 0; a < attachmentCount; a++) {
            const ext = randomItem(['pdf', 'png', 'docx', 'xlsx']);
            const filename = `${faker.system.commonFileName(ext)}`;
            await prisma.attachment.create({
              data: {
                cardId: card.id,
                uploadedBy: randomItem(memberUsers).id,
                filename,
                fileUrl: `https://example-bucket.s3.amazonaws.com/${card.id}/${filename}`,
              },
            });
          }
        }
      }
    }
  }

  console.log('');
  console.log('Seed complete:');
  console.log(`  Users:  ${users.length}`);
  console.log(
    `  Boards: ${boards.length} (${boards.map((b) => `"${b.title}"`).join(', ')})`,
  );
  console.log(`  Cards:  ${totalCards}`);
  console.log('');
  console.log('Test login for any seeded user:');
  console.log(`  email:    ${users[0].email}`);
  console.log(`  username: ${users[0].username}`);
  console.log(`  password: ${SEED_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

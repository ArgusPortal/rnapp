import { relations } from 'drizzle-orm';
import {
  text,
  integer,
  primaryKey,
  sqliteTable,
  blob,
} from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  clerk_id: text('clerk_id').unique().notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
});

export const project = sqliteTable('project', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  created_by: text('created_by').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).defaultNow(),
  updated_at: integer('updated_at', { mode: 'timestamp' }).defaultNow(),
});

export const task = sqliteTable('task', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status', { enum: ['to-do', 'doing', 'done'] }).default('to-do'),
  project_id: integer('project_id'),
  assigned_to: text('assigned_to'),
  created_by: text('created_by').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).defaultNow(),
  updated_at: integer('updated_at', { mode: 'timestamp' }).defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  projects: many(project),
  tasks: many(task),
}));

export const projectRelations = relations(project, ({ many }) => ({
  tasks: many(task),
}));

export const taskRelations = relations(task, ({ one }) => ({
  project: one(project, {
    fields: [task.project_id],
    references: [project.id],
  }),
}));

export type TSelectUser = typeof user.$inferSelect;
export type TInsertUser = typeof user.$inferInsert;

export type TSelectProject = typeof project.$inferSelect;
export type TInsertProject = typeof project.$inferInsert;

export type TSelectTask = typeof task.$inferSelect;
export type TInsertTask = typeof task.$inferInsert;

export enum ETaskStatus {
  TODO = 'to-do',
  DOING = 'doing',
  DONE = 'done',
}

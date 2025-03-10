import type { Request, Response } from 'express';
import { db } from '../../db/drizzle';
import {
	TInsertUser,
	TSelectUser,
	TSelectProject,
	TSelectTask,
	user,
	project,
	task,
} from '../../db/schema';
import { eq } from 'drizzle-orm';
import { jwtDecode } from 'jwt-decode';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { SQL } from 'drizzle-orm'; // Add this import

type UpdateUserPayload = {
	name: string;
	email: string;
};

export const getAllUsers = async (_: Request, res: Response) => {
	try {
		const users: TSelectUser[] = await db.query.user.findMany();

		if (users.length === 0) {
			return res.status(404).json({
				message: 'No users',
				data: [],
			});
		}

		return res.status(200).json({
			message: 'Users found',
			data: users,
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Internal server error',
			data: [],
		});
	}
};

export const getUserById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const findedUser = await db.query.user.findFirst({
			where: (userTable: typeof user, { eq }: { eq: (column: any, value: any) => SQL }) => 
				eq(userTable.id, Number(id)),
		});

		if (!findedUser) {
			return res.status(404).json({
				message: 'User not found',
				data: {},
			});
		}

		return res.status(200).json({
			message: 'User found',
			data: findedUser,
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Internal server error',
			data: {},
		});
	}
};

export const getMe = async (req: Request, res: Response) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res.status(401).json({
				message: 'Unauthorized, token required',
				data: {},
			});
		}

		const decoded = jwtDecode<{ sub?: string }>(token);
		const findedUser = await db.query.user.findFirst({
			where: (userTable: typeof user, { eq }: { eq: (column: any, value: any) => SQL }) => 
				eq(userTable.clerk_id, decoded.sub ?? ''),
		});

		if (!findedUser) {
			return res.status(404).json({
				message: 'User not found',
				data: {},
			});
		}

		return res.status(200).json({
			message: 'User found',
			data: findedUser,
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Internal server error',
			data: {},
		});
	}
};

export const updateMe = async (req: Request, res: Response) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res.status(401).json({
				message: 'Unauthorized, token required',
				data: {},
			});
		}

		const { name, email } = req.body;

		if (!name || !email) {
			return res.status(400).json({
				message: 'Name and email are required',
				data: {},
			});
		}

		const decoded = jwtDecode<{ sub?: string }>(token);
		const findedUser = await db.query.user.findFirst({
			where: (userTable: typeof user, { eq }: { eq: (column: any, value: any) => SQL }) => 
				eq(userTable.clerk_id, decoded.sub ?? ''),
		});

		if (!findedUser) {
			return res.status(404).json({
				message: 'User not found',
				data: {},
			});
		}

		const updated_user = await db
			.update(user)
			.set({
				name,
				email
			})
			.where(eq(user.clerk_id, decoded.sub ?? ''))
			.returning();

		return res.status(200).json({
			message: 'User updated',
			data: updated_user[0] || {},
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Internal server error',
			data: {},
		});
	}
};

export const deleteMe = async (req: Request, res: Response) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res.status(401).json({
				message: 'Unauthorized, token required',
				data: {},
			});
		}

		const decoded = jwtDecode<{ sub?: string }>(token);
		const findedUser = await db.query.user.findFirst({
			where: (userTable: typeof user, { eq }: { eq: (column: any, value: any) => SQL }) => 
				eq(userTable.clerk_id, decoded.sub ?? ''),
		});

		if (!findedUser) {
			return res.status(404).json({
				message: 'User not found',
				data: {},
			});
		}

		await db.delete(user).where(eq(user.clerk_id, decoded.sub ?? ''));

		return res.status(200).json({
			message: 'User deleted',
			data: {},
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Internal server error',
			data: {},
		});
	}
};

export const getStats = async (_: Request, res: Response) => {
	try {
		const users: TSelectUser[] = await db.query.user.findMany();
		const projects: TSelectProject[] = await db.query.project.findMany();
		const tasks: TSelectTask[] = await db.query.task.findMany();

		const completedTasks = tasks.filter(
			task => task.status === 'done',
		).length;

		return res.status(200).json({
			message: 'Stats found',
			data: {
				users: users.length,
				projects: projects.length,
				tasks: tasks.length,
				completedTasks,
				openTasks: tasks.length - completedTasks,
			},
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Internal server error',
			data: {},
		});
	}
};

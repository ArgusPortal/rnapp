import type { Request, Response } from 'express';
import { db } from '../../db/drizzle';
import { TInsertUser, user } from '../../db/schema';

type SignupPayload = Pick<
	TInsertUser,
	'clerk_id' | 'name' | 'email'
>;

export const signup = async (req: Request, res: Response) => {
	try {
		const { clerk_id, name, email }: SignupPayload = req.body;

		if (!clerk_id || !name || !email) {
			return res.status(400).json({
				message: 'Clerk ID, name, and email are required',
				data: {},
			});
		}

		const createdUser = await db.insert(user).values({
			clerk_id,
			name,
			email,
		});

		return res.status(201).json({
			message: 'User created',
			data: createdUser,
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Internal server error',
			data: {},
		});
	}
};

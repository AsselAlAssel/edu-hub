// pages/api/session-validity.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/libs/prismaDb'; // Make sure this path is correct

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.query;

    try {
        const session = await prisma.session.findUnique({
            where: { sessionToken: token as string },
        });

        if (session && session.expires > new Date()) {
            res.status(200).json({ valid: true });
        } else {
            res.status(200).json({ valid: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

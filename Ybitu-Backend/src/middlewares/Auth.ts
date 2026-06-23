import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

export const Auth = {
    private: (req: Request, res: Response, next: NextFunction) => {
        let success = false;

        const token = req.cookies.token;

        if (token) {
            try {
                jwt.verify(token, process.env.JWT_SECRET_KEY as string)
                success = true;
            }
            catch (err) {
                console.log(err);
            }
        }

        if (success) {
            next();
        }
        else {
            res.status(403);
            res.json({ error: "Não autorizado" });
        }
    }
};

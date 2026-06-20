import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

export const Auth = {
    private: (req: Request, res: Response, next: NextFunction) => {
        let success = false;

        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ");

            try {
                if (token[0] === "Bearer" && token[1] !== undefined) {
                    const verification = jwt.verify(token[1], process.env.JWT_SECRET_KEY as string)
                    success = true;
                }
            }
            catch(err){
                
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

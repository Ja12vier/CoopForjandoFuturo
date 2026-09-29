import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class UserAuthorizationMiddleware implements NestMiddleware{
    use(req: Request, res:Response, next:Function){
        const {authorization}=req.headers;
         
        if(!authorization){
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }  
   
    next();
    }


}
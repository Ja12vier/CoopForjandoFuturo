import { InternalServerErrorException,ExecutionContext,createParamDecorator } from "@nestjs/common";


export const GetUser= createParamDecorator(
    (_,ctx:ExecutionContext)=>{
        const req=ctx.switchToHttp().getRequest();
        const user=req.user;
        if(!user){
            throw new InternalServerErrorException('User not found in request');
        }
        return user;
    }
)


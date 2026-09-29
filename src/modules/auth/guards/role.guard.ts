import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../Enums/role.enum";
import { ROLES_KEY } from "../decorators/role.decorator";



@Injectable()
export class RoleGuard {
    constructor(
        private readonly reflector:Reflector
    ){}
    
 CanActivate(context:ExecutionContext): boolean | Promise<boolean>{
    const requireRoles=this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,[
        context.getHandler(),
        context.getClass()
    ])

    if(!requireRoles){
        return true;
    }
    const {user}=context.switchToHttp().getRequest();
    return requireRoles.includes(user.role);
 }
}
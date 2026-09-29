import { UserAuthorizationMiddleware } from './user-authorization.middleware';

describe('UserAuthorizationMiddleware', () => {
  it('should be defined', () => {
    expect(new UserAuthorizationMiddleware()).toBeDefined();
  });
});
